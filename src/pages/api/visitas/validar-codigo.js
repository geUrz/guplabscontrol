import connection from "@/libs/db"
import axios from "axios"

const ONE_SIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
const ONE_SIGNAL_API_KEY = process.env.NEXT_PUBLIC_ONESIGNAL_API_KEY;

// Función para enviar notificación
async function sendNotification(header, message, url, playerId) {
  const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${ONE_SIGNAL_API_KEY}`,
  };

  const data = {
      app_id: ONE_SIGNAL_APP_ID,
      include_player_ids: [playerId],
      headings: { en: header },
      contents: { en: message },
      url: url
  };

  console.log('Datos de la notificación:', data);

  try {
      await axios.post('https://onesignal.com/api/v1/notifications', data, { headers });
  } catch (error) {
      if (error.response) {
          console.error('Error en respuesta de OneSignal:', error.response.data);
          console.error('Código de estado:', error.response.status);
      } else {
          console.error('Error en la solicitud:', error.message);
      }
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { codigo, autorizo, playerId } = req.body;

    // Validar si el código fue proporcionado
    if (!codigo) {
      return res.status(400).json({ message: 'Código no proporcionado' })
    }

    try {
      // Obtener la visita asociada al código proporcionado
      const [rows] = await connection.execute(`
        SELECT visitas.id, visitas.usuario_id, visitas.codigo, visitas.visita, visitas.tipovisita, 
               visitas.tipoacceso, visitas.nota, visitas.date, visitas.fromDate, visitas.toDate,visitas.hora, visitas.dias, visitas.estado, visitas.countAcc,
               usuarios.nombre AS usuario_nombre, usuarios.privada AS usuario_privada, usuarios.calle AS usuario_calle, usuarios.casa AS usuario_casa,
               usuarios.onesignal_player_id AS player_id
        FROM visitas
        JOIN usuarios ON visitas.usuario_id = usuarios.id
        WHERE visitas.codigo = ?
      `, [codigo])

      // Si no se encuentran filas, significa que el código es inválido
      if (rows.length === 0) {
        return res.status(400).json({ message: 'Código inválido' })
      }

      // Verificar el estado de la visita
      const visita = rows[0]
      const countAcc = visita.countAcc || 0
      
      if (playerId) {
        await connection.execute('UPDATE usuarios SET onesignal_player_id = ? WHERE id = ?', [playerId, visita.usuario_id]);
      }

      if (visita.estado === 'Sin ingresar') {
        // Actualizar el estado a 'Ingresado' y establecer countAcc a 1
        await connection.execute('UPDATE visitas SET estado = ?, countAcc = ?, autorizo = ? WHERE codigo = ?', ['Ingresado', 1, autorizo, codigo])

        const header = 'Visita'
        const message = `Tu visita ${visita.tipoacceso} ha ingresado: ${visita.visita}`
        const url = '/visitas'
        await sendNotification(header, message, url, visita.player_id)

        return res.status(200).json({
          message: `¡ Código ${visita.tipoacceso} validado !`,
          visita: { ...visita, estado: 'Ingresado', countAcc: 1 }  // Devuelve la visita con el estado actualizado
        })
      } else if (visita.estado === 'Ingresado') {
        if (visita.tipoacceso === 'frecuente') {
          // Incrementar countAcc si el tipo de acceso es frecuente
          await connection.execute('UPDATE visitas SET countAcc = ? WHERE codigo = ?', [countAcc + 1, codigo])

          const header = 'Visita'
          const message = `Tu visita ${visita.tipoacceso} ha ingresado: ${visita.visita}`
          const url = '/visitas'
          await sendNotification(header, message, url, visita.player_id)

          return res.status(200).json({
            message: `¡ Código ${visita.tipoacceso} válido !\n El visitante ha ingresado ${countAcc + 1} veces.`,
            visita: { ...visita, countAcc: countAcc + 1 } // Actualizar countAcc en el objeto
          })
        } else if (visita.tipoacceso === 'eventual') {
          return res.status(400).json({ message: 'Código utilizado, el visitante ya ingresó' })
        }
      } else if (visita.estado === 'Retirado') {
        return res.status(400).json({ message: 'Código inválido, el visitante ya se retiró' })
      } else {
        return res.status(400).json({ message: 'Estado del código no reconocido' })
      }

    } catch (error) {
      console.error('Error en /api/visitas/validar-codigo:', error.message)
      res.status(500).json({ message: 'Error al validar el código', error: error.message })
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' })
  }
}
