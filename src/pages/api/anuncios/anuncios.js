import connection from "@/libs/db"
import axios from "axios";

const ONE_SIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
const ONE_SIGNAL_API_KEY = process.env.NEXT_PUBLIC_ONESIGNAL_API_KEY;

// Función para enviar notificación
async function sendNotificationToResidentialUsers(residencial_id, header, message, url) {
  const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${ONE_SIGNAL_API_KEY}`,
  };

  try {
      // Obtener todos los usuarios logueados con el mismo residencial_id
      const [users] = await connection.query(
          'SELECT onesignal_player_id FROM usuarios WHERE residencial_id = ? AND onesignal_player_id IS NOT NULL',
          [residencial_id]
      );

      if (users.length === 0) {
          console.log('No se encontraron usuarios para enviar notificaciones.');
          return;
      }

      // Extraer los player_ids de los usuarios
      //const playerIds = users.map(user => user.onesignal_player_id);

      let playerIds = [];
        users.forEach(user => {
            // Verificar si hay más de un player_id y convertirlo en array
            if (user.onesignal_player_id.includes(',')) {
                playerIds = playerIds.concat(user.onesignal_player_id.split(','));
            } else {
                playerIds.push(user.onesignal_player_id);
            }
        })

      const data = {
          app_id: ONE_SIGNAL_APP_ID,
          include_player_ids: playerIds,  // Enviar notificación solo a estos usuarios
          headings: { en: header },
          contents: { en: message },
          url: url,
      };

      // Enviar la notificación a OneSignal
      await axios.post('https://onesignal.com/api/v1/notifications', data, { headers });

  } catch (error) {
      console.error('Error sending notification:', error.message);
  }
}

export default async function handler(req, res) {
  const { id, residencial_id, usuario_id, search } = req.query; // Agregamos 'search' al destructuring

  if (req.method === 'GET') {

    // Caso para búsqueda de anuncios insensible a mayúsculas y minúsculas
    if (search) {
      const searchQuery = `%${search.toLowerCase()}%`; // Convertimos la búsqueda a minúsculas
      try {
        const [rows] = await connection.query(
          `SELECT 
            id, 
            usuario_id, 
            folio, 
            anuncio, 
            descripcion, 
            date, 
            hora,
            residencial_id 
          FROM anuncios 
          WHERE 
            LOWER(anuncio) LIKE ? 
          OR 
            LOWER(folio) LIKE ? 
          OR 
            LOWER(descripcion) LIKE ?
          OR 
            LOWER(date) LIKE ?
          OR 
            LOWER(hora) LIKE ?`,
          [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery]
        )

        /* if (rows.length === 0) {
          return res.status(404).json({ message: 'No se encontraron anuncios' });
        } */

        res.status(200).json(rows);
      } catch (error) {
        res.status(500).json({ error: 'Error al realizar la búsqueda' });
      }
      return
    }

    // Caso para obtener anuncio por usuario_id
    if (residencial_id) {
      try {
        const [rows] = await connection.query('SELECT id, usuario_id, folio, anuncio, descripcion, date, hora, residencial_id FROM anuncios WHERE residencial_id = ? ORDER BY updatedAt DESC', [residencial_id]);
        /* if (rows.length === 0) {
          return res.status(404).json({ error: 'Anuncio no encontrado' })
        } */
        res.status(200).json(rows)
        //res.status(200).json(rows[0])
      } catch (error) {
        res.status(500).json({ error: error.message })
      }
      return;
    }

    // Caso para obtener todos los anuncios
    try {
      const [rows] = await connection.query(
        `SELECT
        anuncios.id,
        anuncios.usuario_id,
        usuarios.nombre AS usuario_nombre,
        usuarios.isadmin AS usuario_isadmin,
        anuncios.folio,
        anuncios.anuncio,
        anuncios.descripcion,
        anuncios.date,
        anuncios.hora,
        anuncios.residencial_id
    FROM anuncios
    JOIN usuarios ON anuncios.usuario_id = usuarios.id
    ORDER BY anuncios.updatedAt DESC
    `)
      res.status(200).json(rows)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else if (req.method === 'POST') {
    try {
      const { usuario_id, folio, anuncio, descripcion, date, hora, residencial_id } = req.body;
      if (!usuario_id || !anuncio || !descripcion || !hora || !residencial_id) {
        return res.status(400).json({ error: 'Todos los datos son obligatorios' })
      }

      const [result] = await connection.query(
        'INSERT INTO anuncios (usuario_id, folio, anuncio, descripcion, date, hora, residencial_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [usuario_id, folio, anuncio, descripcion, date, hora, residencial_id]
      )

      // Enviar notificación después de crear el anuncio
      const header = 'Anuncio'
      const message = `${anuncio}`
      const url = '/anuncios'
      await sendNotificationToResidentialUsers(residencial_id, header, message, url)

      const newClient = { id: result.insertId }
      res.status(201).json(newClient)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else if (req.method === 'PUT') {
    // Actualización del anuncio
    const { anuncio, descripcion, date, hora } = req.body;

    if (!anuncio || !descripcion || !date || !hora || !id) {
      return res.status(400).json({ error: 'ID, anuncio y descripción son obligatorios' });
    }

    try {
      const [result] = await connection.query(
        'UPDATE anuncios SET anuncio = ?, descripcion = ?, date = ?, hora = ? WHERE id = ?',
        [anuncio, descripcion, date, hora, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Anuncio no encontrado' });
      }

      res.status(200).json({ message: 'Anuncio actualizado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    if (!id) {
      return res.status(400).json({ error: 'ID de del anuncio es obligatorio' });
    }

    else {
      // Eliminar el anuncio por ID
      try {
        const [result] = await connection.query('DELETE FROM anuncios WHERE id = ?', [id]);

        // Verificar si el anuncio fue eliminado
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Anuncio no encontrado' });
        }

        res.status(200).json({ message: 'Anuncio eliminado correctamente' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
