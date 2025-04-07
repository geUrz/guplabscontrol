import connection from "@/libs/db";

export default async function handler(req, res) {
    const { residencial_id, fecha_limite } = req.query;

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

            // Filtro por residencial_id
            if (residencial_id) {
                query += " WHERE reportevisitas.residencial_id = ?";
                params.push(residencial_id);
            }

            // Filtro por fecha_limite
            if (fecha_limite) {
                query += params.length ? " AND reportevisitas.updatedAt <= ?" : " WHERE reportevisitas.updatedAt <= ?";
                params.push(fecha_limite); // Usamos fecha_limite como la fecha de corte para las visitas
            }

            query += " ORDER BY reportevisitas.updatedAt DESC";

            const [rows] = await connection.query(query, params);

            res.status(200).json(rows);
        } catch (error) {
            console.error("Error al obtener las visitas:", error);
            res.status(500).json({ error: "Error al obtener las visitas" });
        }
    } else if (req.method === 'DELETE') {
        if (!fecha_limite) {
            return res.status(400).json({ error: 'La fecha límite es obligatoria' });
        }

        // Eliminar las visitas que tengan una fecha de actualización anterior a la fecha límite
        try {
            const [result] = await connection.query(
                'DELETE FROM reportevisitas WHERE updatedAt <= ?',
                [fecha_limite]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'No se encontraron visitas para eliminar' });
            }

            res.status(200).json({ message: 'Visitas eliminadas correctamente' });
        } catch (error) {
            console.error('Error en el servidor al eliminar las visitas:', error.message, error.stack);
            res.status(500).json({ error: 'Error interno del servidor al eliminar las visitas' });
        }
    } else {
        res.setHeader("Allow", ['GET', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
