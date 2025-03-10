import connection from "@/libs/db";
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

        // Extraer los player_ids y convertirlos en un array
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
            include_player_ids: playerIds,
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
    const { id, residencial_id, usuario_id, search } = req.query

    if (req.method === 'GET') {

        if (search) {
            const searchQuery = `%${search.toLowerCase()}%`;
            try {
                const [rows] = await connection.query(
                    `SELECT
                        id, 
                        usuario_id, 
                        folio, 
                        incidencia, 
                        descripcion, 
                        zona, 
                        estado, 
                        title1, 
                        title2, 
                        title3, 
                        title4, 
                        img1, 
                        img2, 
                        img3, 
                        img4, 
                        residencial_id, 
                        createdAt
                    FROM incidencias 
                    WHERE 
                    LOWER(folio) LIKE ? 
                    OR 
                    LOWER(incidencia) LIKE ?
                    OR 
                    LOWER(descripcion) LIKE ? 
                    OR 
                    LOWER(zona) LIKE ? 
                    OR 
                    LOWER(estado) LIKE ?
                    OR 
                    LOWER(createdAt) LIKE ?`,
                    [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery]
                );

                if (rows.length === 0) {
                    return res.status(404).json({ message: 'No se encontraron incidencias' });
                } 

                res.status(200).json(rows);
            } catch (error) {
                res.status(500).json({ error: 'Error al realizar la búsqueda' });
            }
            return;
        }

        // Caso para obtener incidencia por usuario_id
        if (residencial_id) {
            try {
                const [rows] = await connection.query(
                    `SELECT 
                        id, 
                        usuario_id, 
                        folio, 
                        incidencia, 
                        descripcion, 
                        zona, 
                        estado, 
                        title1, 
                        title2, 
                        title3, 
                        title4, 
                        img1, 
                        img2, 
                        img3, 
                        img4, 
                        residencial_id, 
                        createdAt 
                    FROM incidencias 
                    WHERE 
                        residencial_id = ? 
                    ORDER BY updatedAt DESC`,
                    [residencial_id]
                )
                /* if (rows.length === 0) {
                    return res.status(404).json({ error: 'Incidencia no encontrada' });
                } */
                res.status(200).json(rows);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            return;
        }

        // Caso para obtener todas las incidencias
        try {
            const [rows] = await connection.query(
                `SELECT 
                    incidencias.id, 
                    incidencias.usuario_id, 
                    usuarios.nombre AS usuario_nombre,
                    usuarios.usuario AS usuario_usuario, 
                    usuarios.privada AS usuario_privada,
                    usuarios.calle AS usuario_calle, 
                    usuarios.casa AS usuario_casa,
                    incidencias.folio, 
                    incidencias.incidencia, 
                    incidencias.descripcion,
                    incidencias.zona, 
                    incidencias.estado, 
                    incidencias.title1, 
                    incidencias.title2, 
                    incidencias.title3, 
                    incidencias.title4, 
                    incidencias.img1,
                    incidencias.img2, 
                    incidencias.img3, 
                    incidencias.img4, 
                    incidencias.residencial_id, 
                    incidencias.createdAt
                 FROM incidencias
                 JOIN usuarios ON incidencias.usuario_id = usuarios.id
                 ORDER BY incidencias.updatedAt DESC`
            );
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'POST') {
        try {
            const { usuario_id, folio, incidencia, descripcion, zona, estado, residencial_id } = req.body;
            if (!usuario_id || !incidencia || !descripcion || !residencial_id) {
                return res.status(400).json({ error: 'Todos los datos son obligatorios' });
            }

            const [result] = await connection.query(
                'INSERT INTO incidencias (usuario_id, folio, incidencia, descripcion, zona, estado, residencial_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [usuario_id, folio, incidencia, descripcion, zona, estado, residencial_id]
            );

            const header = 'Incidencia';
            const message = `${incidencia}`;
            const url = '/incidencias';
            await sendNotificationToResidentialUsers(residencial_id, header, message, url)

            const newClient = { id: result.insertId };
            res.status(201).json(newClient);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'PUT') {
        if (!id) {
            return res.status(400).json({ error: 'ID de la incidencia es obligatorio' });
        }

        const { incidencia, descripcion, zona, estado } = req.body;

        if (!incidencia || !descripcion || !zona || !estado || !id) {
            return res.status(400).json({ error: 'ID, incidencia, descripción, zona y estado son obligatorios' });
        }

        try {
            const [result] = await connection.query(
                'UPDATE incidencias SET incidencia = ?, descripcion = ?, zona = ?, estado = ? WHERE id = ?',
                [incidencia, descripcion, zona, estado, id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Incidencia no encontrada' });
            }

            res.status(200).json({ message: 'Incidencia actualizada correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'DELETE') {
        if (!id) {
            return res.status(400).json({ error: 'ID de la incidencia es obligatorio' });
        }

        // Eliminar la incidencia por ID
        try {
            const [result] = await connection.query('DELETE FROM incidencias WHERE id = ?', [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Incidencia no encontrada' });
            }

            res.status(200).json({ message: 'Incidencia eliminada correctamente' });
        } catch (error) {
            console.error('Error en el servidor al eliminar la incidencia:', error.message, error.stack);
            res.status(500).json({ error: 'Error interno del servidor al eliminar la incidencia' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
