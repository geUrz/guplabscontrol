import multer from 'multer';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import connection from '@/libs/db';

const uploadFolder = './public/uploads';

// Crea la carpeta de subida si no existe
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const uploadHandler = upload.single('file');

    uploadHandler(req, res, async (err) => {
      if (err) {
        console.error('Error al subir la imagen:', err);
        return res.status(500).json({ error: 'Error al subir la imagen', details: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No se ha subido ningún archivo' });
      }

      try {
        // Procesa y redimensiona la imagen
        const resizedImageBuffer = await sharp(req.file.buffer)
          .rotate()
          .resize(800, null) // Ancho máximo 800px; altura ajustada proporcionalmente
          .jpeg({ quality: 80 }) // Forza salida como formato JPEG con calidad 80%
          .toBuffer();

        // Asegurar la extensión del archivo como .jpg
        const uploadFolder = path.join(process.cwd(), 'uploads')
        const fileName = `${Date.now()}.jpg`
        const filePath = path.join(uploadFolder, fileName);
        fs.writeFileSync(filePath, resizedImageBuffer); // Escribe la imagen en disco

        // Crear la ruta relativa para almacenar en la base de datos
        const fileDbPath = `/api/uploads/${fileName}`;

        const { id, imageKey } = req.body;

        if (!id || !imageKey) {
          return res.status(400).json({ error: 'ID de la incidencia o key de la imagen no proporcionados' });
        }

        // Actualizar la base de datos con la ruta de la imagen
        const updateQuery = `
          UPDATE incidencias
          SET ${imageKey} = ?
          WHERE id = ?;
        `;
        const [result] = await connection.execute(updateQuery, [fileDbPath, id]);

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Incidencia no encontrada' });
        }

        return res
          .setHeader('Cache-Control', 'no-cache')
          .status(200)
          .json({ filePath: fileDbPath });
      } catch (sharpError) {
        console.error('Error al redimensionar la imagen:', sharpError);
        return res.status(500).json({ error: 'Error al procesar la imagen', details: sharpError.message });
      }
    });
  } else if (req.method === 'DELETE') {
    const { id, imageKey } = req.query;

    if (!id || !imageKey) {
      return res.status(400).json({ error: 'ID de la incidencia o key de la imagen no proporcionados' });
    }

    try {
      // Obtener la ruta de la imagen desde la base de datos
      const selectQuery = `
        SELECT ${imageKey} AS filePath
        FROM incidencias
        WHERE id = ?;
      `;
      const [rows] = await connection.execute(selectQuery, [id]);

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Incidencia no encontrada' });
      }

      const { filePath } = rows[0];

      // Verificar si la ruta es válida y eliminar el archivo de la carpeta
      if (filePath) {
        const uploadFolder = path.join(process.cwd(), 'uploads') // Asegura la ruta consistente
        const fullPath = path.join(uploadFolder, path.basename(filePath))


        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          console.log(`Archivo ${fullPath} eliminado correctamente.`);
        } else {
          console.log(`No se encontró el archivo ${fullPath}`);
        }
      }

      // Actualizar el campo en la base de datos a NULL
      const updateQuery = `
        UPDATE incidencias
        SET ${imageKey} = NULL
        WHERE id = ?;
      `;
      const [result] = await connection.execute(updateQuery, [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'No se pudo actualizar la incidencia' });
      }

      return res.status(200).json({ message: 'Imagen eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
      return res.status(500).json({ error: 'Error al eliminar la imagen', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST', 'DELETE']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
};

export default handler;
