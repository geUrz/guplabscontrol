import connection from "@/libs/db"; // Importa la configuración de la base de datos

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    const { mensaje } = req.body;

    if (!mensaje || mensaje.trim() === '') {
        return res.status(400).json({ message: 'El mensaje no puede estar vacío' });
    }

    try {
        // Inserta el mensaje en la tabla "mensajes"
        const [result] = await connection.execute(
            'INSERT INTO mensajes (mensaje) VALUES (?)',
            [mensaje]
        );

        // Responde con el ID del nuevo mensaje insertado
        res.status(200).json({ message: 'Mensaje guardado con éxito', id: result.insertId });
    } catch (error) {
        console.error('Error al guardar el mensaje:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}
