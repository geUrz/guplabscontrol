import connection from "@/libs/db";

export default async function handler(req, res) {
    const { id, residencial_id, search } = req.query; // Se añade `id` para la búsqueda por ID

    if (req.method === 'GET') {

        if (id) {
            try {
                const [rows] = await connection.query(`
                SELECT 
                    id,
                    usuario_id,
                    folio,
                    recibo,
                    nota,
                    residencial_id,
                    createdAt
                FROM recibos 
                WHERE recibos.id = ?
                ORDER BY recibos.updatedAt DESC`, [id]);

                res.status(200).json(rows[0]); // Devolver el evento con los datos del cliente

            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            return;
        }

        if (residencial_id) {
            try {
                const [rows] = await connection.query(`
                SELECT 
                    recibos.id, 
                    recibos.usuario_id, 
                    recibos.folio, 
                    recibos.recibo, 
                    recibos.nota, 
                    recibos.residencial_id, 
                    residenciales.nombre AS residencial_nombre, 
                    recibos.updatedAt,  
                    recibos.createdAt
                FROM 
                    recibos
                JOIN
                    residenciales
                ON
                    recibos.residencial_id = residenciales.id
                WHERE recibos.residencial_id = ?
                ORDER BY recibos.updatedAt DESC`, [residencial_id]);

                res.status(200).json(rows); // Devolver el evento con los datos del cliente

            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            return;
        }

        if (search) {
            const searchQuery = `%${search.toLowerCase()}%`;
            try {
                const [rows] = await connection.query(`
                    SELECT
                        recibos.id, 
                        recibos.usuario_id, 
                        recibos.folio, 
                        recibos.recibo,
                        recibos.nota, 
                        recibos.residencial_id, 
                        residenciales.nombre AS residencial_nombre, 
                        recibos.updatedAt,  
                        recibos.createdAt
                    FROM recibos
                    JOIN residenciales ON recibos.residencial_id = residenciales.id
                    WHERE 
                        LOWER(recibos.folio) LIKE ?  
                    OR 
                        LOWER(recibos.recibo) LIKE ?
                    OR 
                        LOWER(recibos.nota) LIKE ?
                    OR 
                        LOWER(recibos.createdAt) LIKE ?  
                    ORDER BY recibos.updatedAt DESC`, [searchQuery, searchQuery, searchQuery, searchQuery]);

                res.status(200).json(rows); // Devolver los recibos encontrados por búsqueda

            } catch (error) {
                res.status(500).json({ error: 'Error al realizar la búsqueda' });
            }
            return;
        }

        try {
            const [rows] = await connection.query(`
                SELECT 
                    recibos.id, 
                    recibos.usuario_id, 
                    recibos.folio, 
                    recibos.recibo,
                    recibos.nota, 
                    recibos.residencial_id, 
                    residenciales.nombre AS residencial_nombre, 
                    recibos.updatedAt,  
                    recibos.createdAt
                FROM 
                    recibos
                JOIN
                    residenciales
                ON
                    recibos.residencial_id = residenciales.id
                ORDER BY recibos.updatedAt DESC`);

            res.status(200).json(rows); // Devolver todos los recibos con los datos de los clientes

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'POST') {
        // Maneja la solicitud POST
        const { usuario_id, folio, recibo, residencial_id } = req.body;

        try {
            const [result] = await connection.query(
                'INSERT INTO recibos (usuario_id, folio, recibo, residencial_id) VALUES (?, ?, ?, ?)',
                [usuario_id, folio, recibo, residencial_id]
            );
            res.status(201).json({ id: result.insertId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'PUT') {

        const { id } = req.query;
        const { recibo } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'ID del recibo es obligatorio' });
        }

        if (recibo) {
            try {
                const [result] = await connection.query(
                    'UPDATE recibos SET recibo = ? WHERE id = ?',
                    [recibo, id]
                );

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Recibo no encontrado' });
                }

                res.status(200).json({ message: 'Recibo actualizado correctamente' });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        } else {
            return res.status(400).json({ error: 'Datos insuficientes para actualizar el recibo' });
        }

    } else if (req.method === 'DELETE') {
        // Maneja la solicitud DELETE
        const { id } = req.query;

        try {
            const [result] = await connection.query(
                'DELETE FROM recibos WHERE id = ?',
                [id]
            );

            if (result.affectedRows > 0) {
                res.status(200).json({ message: 'Recibo eliminado correctamente' });
            } else {
                res.status(404).json({ message: 'Recibo no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
