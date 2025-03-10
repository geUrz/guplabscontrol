import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { playerId, userId, userName, userUsername } = req.body;

  if (!playerId || !userId || !userName || !userUsername) {
    return res.status(400).json({ message: 'Faltan datos necesarios para enviar el correo.' });
  }

  // Configurar transporte de correo
  const transporter = nodemailer.createTransport({
    service: 'gmail', // O utiliza un proveedor como SendGrid o Mailgun
    auth: {
      user: process.env.EMAIL_USER, // Tu correo
      pass: process.env.EMAIL_PASS, // Tu contraseña o clave de aplicación
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER, // Remitente
    to: 'devcactus.soporte@gmail.com',   // Correo donde recibirás la notificación
    subject: 'Nuevo dispositivo suscrito a notificaciones',
    text: `Un nuevo dispositivo se ha suscrito.
          \nNombre: ${userName},
          \nUsuario: ${userUsername},
          \nUser ID: ${userId},
          \nPlayer ID: ${playerId}`
  }

  try {

    console.log('Intentando enviar correo a:', mailOptions.to)
    // Enviar correo
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo enviado exitosamente' });
  } catch (error) {
    console.error('Error enviando correo:', error);
    res.status(500).json({ message: 'Error enviando correo', error: error.message });
  }
}
