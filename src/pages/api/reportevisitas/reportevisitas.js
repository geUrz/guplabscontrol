import connection from "@/libs/db";

export default async function handler(req, res) {
    const { id, residencial_id, search, fecha_limite } = req.query;

    if (req.method === "GET") {
        try {
            let query = `
                SELECT
                    reportevisitas.id,
                    reportevisitas.usuario_id,
                    usuarios.nombre AS usuario_nombre,
                    usuarios.usuario AS usuario_usuario,
                    usuarios.privada AS usuario_privada,
                    usuarios.calle AS usuario_calle,
                    usuarios.casa AS usuario_casa,
                    reportevisitas.visita,
                    reportevisitas.tipovisita,
                    reportevisitas.tipoacceso,
                    reportevisitas.date,
                    reportevisitas.fromDate,
                    reportevisitas.toDate,
                    reportevisitas.estado,
                    reportevisitas.dias,
                    reportevisitas.autorizo,
                    reportevisitas.autorizo_lector,
                    reportevisitas.action,
                    reportevisitas.img1, reportevisitas.img2, reportevisitas.img3, reportevisitas.img4, 
                    reportevisitas.img5, reportevisitas.img6, reportevisitas.img7,
                    reportevisitas.residencial_id,
                    reportevisitas.updatedAt,
                    reportevisitas.createdAt
                FROM reportevisitas
                JOIN usuarios ON reportevisitas.usuario_id = usuarios.id
            `;

            const params = [];

            if (residencial_id) {
                query += " WHERE reportevisitas.residencial_id = ?";
                params.push(residencial_id);
            }

            if (fecha_limite) {
  
                query += params.length ? " AND reportevisitas.createdAt >= ?" : " WHERE reportevisitas.createdAt >= ?";
                params.push(fecha_limite);
            }

            if (search) {
                const searchQuery = `%${search.toLowerCase()}%`;
                if (params.length) {
                    query += ` AND (LOWER(usuarios.nombre) LIKE ? 
                        OR LOWER(usuarios.privada) LIKE ? 
                        OR LOWER(usuarios.calle) LIKE ? 
                        OR LOWER(usuarios.casa) LIKE ? 
                        OR LOWER(reportevisitas.visita) LIKE ? 
                        OR LOWER(reportevisitas.tipovisita) LIKE ? 
                        OR LOWER(reportevisitas.tipoacceso) LIKE ? 
                        OR LOWER(reportevisitas.fromDate) LIKE ? 
                        OR LOWER(reportevisitas.toDate) LIKE ? 
                        OR LOWER(reportevisitas.estado) LIKE ? 
                        OR LOWER(reportevisitas.action) LIKE ? 
                        OR LOWER(reportevisitas.createdAt) LIKE ?)`
                } else {
                    query += ` WHERE (LOWER(usuarios.nombre) LIKE ? 
                        OR LOWER(usuarios.privada) LIKE ? 
                        OR LOWER(usuarios.calle) LIKE ? 
                        OR LOWER(usuarios.casa) LIKE ? 
                        OR LOWER(reportevisitas.visita) LIKE ? 
                        OR LOWER(reportevisitas.tipovisita) LIKE ? 
                        OR LOWER(reportevisitas.tipoacceso) LIKE ? 
                        OR LOWER(reportevisitas.fromDate) LIKE ? 
                        OR LOWER(reportevisitas.toDate) LIKE ? 
                        OR LOWER(reportevisitas.estado) LIKE ? 
                        OR LOWER(reportevisitas.action) LIKE ? 
                        OR LOWER(reportevisitas.createdAt) LIKE ?)`
                }

                params.push(searchQuery, searchQuery, searchQuery, searchQuery,
                    searchQuery, searchQuery, searchQuery, searchQuery, searchQuery,
                    searchQuery, searchQuery, searchQuery, searchQuery);
            }

            query += " ORDER BY reportevisitas.updatedAt DESC";

            const [rows] = await connection.query(query, params);

            res.status(200).json(rows);
        } catch (error) {
            console.error("Error al obtener las visitas:", error);
            res.status(500).json({ error: "Error al obtener las visitas" });
        }
    } else if (req.method === 'DELETE') {
        if (!id) {
            return res.status(400).json({ error: 'ID de la visita es obligatorio' });
        }

        try {
            const [result] = await connection.query('DELETE FROM reportevisitas WHERE id = ?', [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Visita no encontrada' });
            }

            res.status(200).json({ message: 'Visita eliminada correctamente' });
        } catch (error) {
            console.error('Error en el servidor al eliminar la visita:', error.message, error.stack);
            res.status(500).json({ error: 'Error interno del servidor al eliminar la visita' });
        }
    } else {
        res.setHeader("Allow", ['GET', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
