import connection from '@/libs/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'ID de visita técnica es obligatorio' });
    }

    try {
      const [images] = await connection.query(
        'SELECT * FROM visitatecnica WHERE id = ?',
        [id]
      );
      return res.status(200).json(images);
    } catch (error) {
      console.error('Error al obtener las imágenes:', error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Método ${req.method} no permitido`);
  }
}
