import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { image } = req.query; // Extraemos el nombre de la imagen desde la URL
  const uploadsDir = path.join(process.cwd(), 'uploads'); // Ruta completa a la carpeta "uploads"
  const imagePath = path.join(uploadsDir, image);

  // Verifica si el archivo existe
  if (fs.existsSync(imagePath)) {
    const mimeTypes = {
      '.jpeg': 'image/jpeg',
      '.jpg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
    };

    const ext = path.extname(imagePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    res.setHeader('Content-Type', contentType); // Define el tipo de contenido dinámicamente
    res.setHeader('Cache-Control', 'no-cache'); // Evita el caché del navegador/servidor
    fs.createReadStream(imagePath).pipe(res); // Envia la imagen al cliente
  } else {
    res.status(404).send('Imagen no encontrada');
  }
}
