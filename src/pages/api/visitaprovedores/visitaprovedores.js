import connection from "@/libs/db"
import axios from "axios";

const ONE_SIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
const ONE_SIGNAL_API_KEY = process.env.NEXT_PUBLIC_ONESIGNAL_API_KEY;

// Función para enviar notificación
async function sendNotificationToResidentialUsers(residencial_id, header, message, url) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${ONE_SIGNAL_API_KEY}`,
    };

    try {
        // Obtener todos los usuarios logueados con el mismo residencial_id
        const [users] = await connection.query(
            'SELECT onesignal_player_id FROM usuarios WHERE residencial_id = ? AND onesignal_player_id IS NOT NULL',
            [residencial_id]
        );

        if (users.length === 0) {
            console.log('No se encontraron usuarios para enviar notificaciones.');
            return;
        }

        // Extraer los player_ids de los usuarios
        //const playerIds = users.map(user => user.onesignal_player_id);

        let playerIds = [];
        users.forEach(user => {
            // Verificar si hay más de un player_id y convertirlo en array
            if (user.onesignal_player_id.includes(',')) {
                playerIds = playerIds.concat(user.onesignal_player_id.split(','));
            } else {
                playerIds.push(user.onesignal_player_id);
            }
        })

        const data = {
            app_id: ONE_SIGNAL_APP_ID,
            include_player_ids: playerIds,  // Enviar notificación solo a estos usuarios
            headings: { en: header },
            contents: { en: message },
            url: url,
        };

        // Enviar la notificación a OneSignal
        await axios.post('https://onesignal.com/api/v1/notifications', data, { headers });

    } catch (error) {
        console.error('Error sending notification:', error.message);
    }
}

export default async function handler(req, res) {
    const { id, search, residencial_id, usuario_id } = req.query

    if (req.method === 'GET') {

        if (search) {
            const searchQuery = `%${search.toLowerCase()}%`;
            try {
                const [rows] = await connection.query(`
                    SELECT
                        visitaprovedores.id,
                        visitaprovedores.usuario_id,
                        usuarios.nombre AS usuario_nombre,
                        usuarios.usuario AS usuario_usuario,
                        visitaprovedores.folio,
                        visitaprovedores.visitaprovedor,
                        visitaprovedores.descripcion,
                        visitaprovedores.estado,
                        visitaprovedores.residencial_id,
                        autorizo_usuario.usuario AS autorizo_usuario,
                        visitaprovedores.createdAt
                    FROM visitaprovedores
                    JOIN usuarios ON visitaprovedores.usuario_id = usuarios.id
                    LEFT JOIN usuarios AS autorizo_usuario ON visitaprovedores.autorizo = autorizo_usuario.id
                    WHERE 
                        LOWER(visitaprovedores.folio) LIKE ?  
                    OR 
                        LOWER(visitaprovedores.visitaprovedor) LIKE ?
                    OR 
                        LOWER(visitaprovedores.descripcion) LIKE ?
                    OR 
                        LOWER(visitaprovedores.estado) LIKE ?
                    OR 
                        LOWER(autorizo_usuario.usuario) LIKE ?
                    OR 
                        LOWER(visitaprovedores.createdAt) LIKE ?  
                    ORDER BY visitaprovedores.updatedAt DESC`, [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery]);

                res.status(200).json(rows); // Devolver los recibos encontrados por búsqueda

            } catch (error) {
                res.status(500).json({ error: 'Error al realizar la búsqueda' });
            }
            return;
        }

        if (residencial_id) {
            try {
                const [rows] = await connection.query(
                    `SELECT
                    visitaprovedores.id,
                    visitaprovedores.usuario_id,
                    usuarios.nombre AS usuario_nombre,
                    usuarios.usuario AS usuario_usuario,
                    visitaprovedores.folio,
                    visitaprovedores.visitaprovedor,
                    visitaprovedores.descripcion,
                    visitaprovedores.estado,
                    visitaprovedores.residencial_id,
                    autorizo_usuario.usuario AS autorizo_usuario,
                    visitaprovedores.createdAt
                FROM visitaprovedores
                JOIN usuarios ON visitaprovedores.usuario_id = usuarios.id
                LEFT JOIN usuarios AS autorizo_usuario ON visitaprovedores.autorizo = autorizo_usuario.id
                WHERE visitaprovedores.residencial_id = ?
                ORDER BY visitaprovedores.updatedAt DESC`, 
                [residencial_id])
                /* if (rows.length === 0) {
                    return res.status(404).json({ error: 'Visita provedor no encontrado' })
                } */
                res.status(200).json(rows)
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
            return;
        }

        // Caso para obtener todos los visitaprovedores
        try {
            const [rows] = await connection.query(
                `SELECT
                    visitaprovedores.id,
                    visitaprovedores.usuario_id,
                    usuarios.nombre AS usuario_nombre,
                    usuarios.usuario AS usuario_usuario,
                    visitaprovedores.folio,
                    visitaprovedores.visitaprovedor,
                    visitaprovedores.descripcion,
                    visitaprovedores.estado,
                    visitaprovedores.residencial_id,
                    autorizo_usuario.usuario AS autorizo_usuario,
                    visitaprovedores.createdAt
                FROM visitaprovedores
                JOIN usuarios ON visitaprovedores.usuario_id = usuarios.id
                LEFT JOIN usuarios AS autorizo_usuario ON visitaprovedores.autorizo = autorizo_usuario.id
                ORDER BY visitaprovedores.updatedAt DESC
    `)
            res.status(200).json(rows)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'POST') {
        try {
            const { usuario_id, folio, visitaprovedor, descripcion, estado, autorizo, residencial_id } = req.body;
            if (!usuario_id || !visitaprovedor || !descripcion || !estado || !residencial_id) {
                return res.status(400).json({ error: 'Todos los datos son obligatorios' })
            }

            const [result] = await connection.query(
                'INSERT INTO visitaprovedores (usuario_id, folio, visitaprovedor, descripcion, estado, autorizo, residencial_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [usuario_id, folio, visitaprovedor, descripcion, estado, autorizo, residencial_id]
            )

            // Enviar notificación después de crear la visitaprovedor
            const header = 'Visita proveedor'
            const message = `${visitaprovedor}`
            const url = '/visitaprovedores'
            await sendNotificationToResidentialUsers(residencial_id, header, message, url)
            const newClient = { id: result.insertId }
            res.status(201).json(newClient)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'PUT') {
        if (!id) {
            return res.status(400).json({ error: 'ID de la visitaprovedor es obligatorio' })
        }

        const { visitaprovedor, descripcion, estado } = req.body;

        if (visitaprovedor && descripcion && estado) {
            // Actualización completa del negocio
            try {

                const [result] = await connection.query(
                    'UPDATE visitaprovedores SET visitaprovedor = ?, descripcion = ?, estado = ? WHERE id = ?',
                    [visitaprovedor, descripcion, estado, id]
                )

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Visita provedor no encontrada' })
                }

                res.status(200).json({ message: 'Visita provedor actualizada correctamente' })
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
        } else {
            return res.status(400).json({ error: 'Datos insuficientes para actualizar la visitaprovedor' })
        }
    } else if (req.method === 'DELETE') {
        if (!id) {
            return res.status(400).json({ error: 'ID de la visitaprovedor es obligatorio' })
        }

        else{
            // Eliminar la visitaprovedor por ID
            try {
                const [result] = await connection.query('DELETE FROM visitaprovedores WHERE id = ?', [id])

                // Verificar si el negocio fue eliminado
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Visita provedor no encontrada' })
                }

                res.status(200).json({ message: 'Visita provedor eliminada correctamente' })
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
