import connection from "@/libs/db";

export default async function handler(req, res) {
    const { id, titleKey, titleValue } = req.body;

    if (req.method === 'PUT') {
        if (!id || !titleKey) {
            return res.status(400).json({ error: 'ID, key del título y valor son obligatorios' });
        }

        try {
            const [result] = await connection.query(
                `UPDATE visitatecnica 
                SET ?? = ? 
                WHERE id = ?`,
                [titleKey, titleValue, id] // Usa "??" para el nombre de la columna
            )

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Visita técnica no encontrada' });
            }

            res.status(200).json({ message: 'Título actualizado correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
