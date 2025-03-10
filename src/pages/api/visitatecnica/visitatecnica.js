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

    if (id) {
      try {
        const [rows] = await connection.query(
          `SELECT
            visitatecnica.id,
            visitatecnica.usuario_id,
            usuarios.nombre AS usuario_nombre,
            usuarios.isadmin AS usuario_isadmin,
            visitatecnica.folio,
            visitatecnica.visitatecnica,
            visitatecnica.descripcion,
            visitatecnica.date,
            visitatecnica.estado,
            visitatecnica.residencial_id,
            visitatecnica.title1,
            visitatecnica.title2,
            visitatecnica.title3,
            visitatecnica.title4,
            visitatecnica.title5,
            visitatecnica.title6,
            visitatecnica.title7,
            visitatecnica.title8,
            visitatecnica.title9,
            visitatecnica.title10,
            visitatecnica.title11,
            visitatecnica.title12,
            visitatecnica.title13,
            visitatecnica.title14,
            visitatecnica.title15,
            visitatecnica.title16,
            visitatecnica.title17,
            visitatecnica.title18,
            visitatecnica.title19,
            visitatecnica.title20,
            visitatecnica.img1,
            visitatecnica.img2,
            visitatecnica.img3,
            visitatecnica.img4,
            visitatecnica.img5,
            visitatecnica.img6,
            visitatecnica.img7,
            visitatecnica.img8,
            visitatecnica.img9,
            visitatecnica.img10,
            visitatecnica.img11,
            visitatecnica.img12,
            visitatecnica.img13,
            visitatecnica.img14,
            visitatecnica.img15,
            visitatecnica.img16,
            visitatecnica.img17,
            visitatecnica.img18,
            visitatecnica.img19,
            visitatecnica.img20
          FROM visitatecnica
          JOIN usuarios ON visitatecnica.usuario_id = usuarios.id
          WHERE visitatecnica.id = ?`,
          [id]
        );

        /* if (rows.length === 0) {
          return res.status(404).json({ message: 'Visita técnica no encontrada' });
        } */

        res.status(200).json(rows[0]); // Retornamos el primer resultado
      } catch (error) {
        res.status(500).json({ error: 'Error al obtener la visita técnica' });
      }
      return;
    }

    // Caso para búsqueda de visitatecnica insensible a mayúsculas y minúsculas
    if (search) {
      const searchQuery = `%${search.toLowerCase()}%`; // Convertimos la búsqueda a minúsculas
      try {
        const [rows] = await connection.query(
          `SELECT 
              visitatecnica.id,
              visitatecnica.usuario_id,
              usuarios.nombre AS usuario_nombre,
              usuarios.isadmin AS usuario_isadmin,
              visitatecnica.folio,
              visitatecnica.visitatecnica,
              visitatecnica.descripcion,
              visitatecnica.date,
              visitatecnica.estado,
              visitatecnica.residencial_id,
              visitatecnica.title1,
              visitatecnica.title2,
              visitatecnica.title3,
              visitatecnica.title4,
              visitatecnica.title5,
              visitatecnica.title6,
              visitatecnica.title7,
              visitatecnica.title8,
              visitatecnica.title9,
              visitatecnica.title10,
              visitatecnica.title11,
              visitatecnica.title12,
              visitatecnica.title13,
              visitatecnica.title14,
              visitatecnica.title15,
              visitatecnica.title16,
              visitatecnica.title17,
              visitatecnica.title18,
              visitatecnica.title19,
              visitatecnica.title20,
              visitatecnica.img1,
              visitatecnica.img2,
              visitatecnica.img3,
              visitatecnica.img4,
              visitatecnica.img5,
              visitatecnica.img6,
              visitatecnica.img7,
              visitatecnica.img8,
              visitatecnica.img9,
              visitatecnica.img10,
              visitatecnica.img11,
              visitatecnica.img12,
              visitatecnica.img13,
              visitatecnica.img14,
              visitatecnica.img15,
              visitatecnica.img16,
              visitatecnica.img17,
              visitatecnica.img18,
              visitatecnica.img19,
              visitatecnica.img20
            FROM 
              visitatecnica 
            JOIN usuarios ON visitatecnica.usuario_id = usuarios.id
            WHERE 
              LOWER(visitatecnica.visitatecnica) LIKE ? 
            OR 
              LOWER(visitatecnica.folio) LIKE ? 
            OR 
              LOWER(visitatecnica.descripcion) LIKE ?
            OR 
              LOWER(visitatecnica.date) LIKE ?
            OR 
              LOWER(visitatecnica.estado) LIKE ?`,
          [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery]
        )

        if (rows.length === 0) {
          return res.status(404).json({ message: 'No se encontraron visitatecnica' })
        }

        res.status(200).json(rows)
      } catch (error) {
        res.status(500).json({ error: 'Error al realizar la búsqueda' })
      }
      return
    }

    // Caso para obtener visitatecnica por usuario_id
    if (residencial_id) {
      try {
        const [rows] = await connection.query(
          `SELECT
        visitatecnica.id,
        visitatecnica.usuario_id,
        usuarios.nombre AS usuario_nombre,
        usuarios.isadmin AS usuario_isadmin,
        visitatecnica.folio,
        visitatecnica.visitatecnica,
        visitatecnica.descripcion,
        visitatecnica.date,
        visitatecnica.estado,
        visitatecnica.residencial_id,
        visitatecnica.title1,
        visitatecnica.title2,
        visitatecnica.title3,
        visitatecnica.title4,
        visitatecnica.title5,
        visitatecnica.title6,
        visitatecnica.title7,
        visitatecnica.title8,
        visitatecnica.title9,
        visitatecnica.title10,
        visitatecnica.title11,
        visitatecnica.title12,
        visitatecnica.title13,
        visitatecnica.title14,
        visitatecnica.title15,
        visitatecnica.title16,
        visitatecnica.title17,
        visitatecnica.title18,
        visitatecnica.title19,
        visitatecnica.title20,
        visitatecnica.img1,
        visitatecnica.img2,
        visitatecnica.img3,
        visitatecnica.img4,
        visitatecnica.img5,
        visitatecnica.img6,
        visitatecnica.img7,
        visitatecnica.img8,
        visitatecnica.img9,
        visitatecnica.img10,
        visitatecnica.img11,
        visitatecnica.img12,
        visitatecnica.img13,
        visitatecnica.img14,
        visitatecnica.img15,
        visitatecnica.img16,
        visitatecnica.img17,
        visitatecnica.img18,
        visitatecnica.img19,
        visitatecnica.img20
    FROM visitatecnica
    JOIN usuarios ON visitatecnica.usuario_id = usuarios.id
    WHERE visitatecnica.residencial_id = ?
    ORDER BY visitatecnica.updatedAt DESC`, 
          [residencial_id])
        /* if (rows.length === 0) {
          return res.status(404).json({ error: 'Visita Tecnica no encontrada' })
        } */
        res.status(200).json(rows)
        //res.status(200).json(rows[0])
      } catch (error) {
        res.status(500).json({ error: error.message })
      }
      return;
    }

    // Caso para obtener todos los visitatecnica
    try {
      const [rows] = await connection.query
        `SELECT
        visitatecnica.id,
        visitatecnica.usuario_id,
        usuarios.nombre AS usuario_nombre,
        usuarios.isadmin AS usuario_isadmin,
        visitatecnica.folio,
        visitatecnica.visitatecnica,
        visitatecnica.descripcion,
        visitatecnica.date,
        visitatecnica.estado,
        visitatecnica.residencial_id,
        visitatecnica.title1,
        visitatecnica.title2,
        visitatecnica.title3,
        visitatecnica.title4,
        visitatecnica.title5,
        visitatecnica.title6,
        visitatecnica.title7,
        visitatecnica.title8,
        visitatecnica.title9,
        visitatecnica.title10,
        visitatecnica.title11,
        visitatecnica.title12,
        visitatecnica.title13,
        visitatecnica.title14,
        visitatecnica.title15,
        visitatecnica.title16,
        visitatecnica.title17,
        visitatecnica.title18,
        visitatecnica.title19,
        visitatecnica.title20,
        visitatecnica.img1,
        visitatecnica.img2,
        visitatecnica.img3,
        visitatecnica.img4,
        visitatecnica.img5,
        visitatecnica.img6,
        visitatecnica.img7,
        visitatecnica.img8,
        visitatecnica.img9,
        visitatecnica.img10,
        visitatecnica.img11,
        visitatecnica.img12,
        visitatecnica.img13,
        visitatecnica.img14,
        visitatecnica.img15,
        visitatecnica.img16,
        visitatecnica.img17,
        visitatecnica.img18,
        visitatecnica.img19,
        visitatecnica.img20
    FROM visitatecnica
    JOIN usuarios ON visitatecnica.usuario_id = usuarios.id
    ORDER BY visitatecnica.updatedAt DESC
    `
      res.status(200).json(rows)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else if (req.method === 'POST') {
    try {
      const { usuario_id, folio, visitatecnica, descripcion, date, estado,residencial_id } = req.body;
      if (!usuario_id || !visitatecnica || !descripcion || !residencial_id) {
        return res.status(400).json({ error: 'Todos los datos son obligatorios' })
      }

      const [result] = await connection.query(
        'INSERT INTO visitatecnica (usuario_id, folio, visitatecnica, descripcion, date, estado, residencial_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [usuario_id, folio, visitatecnica, descripcion, date, estado, residencial_id]
      )

      const header = 'Visita técnica'
      const message = `${visitatecnica}`
      const url = '/visitatecnica'
      await sendNotificationToResidentialUsers(residencial_id, header, message, url)

      const newClient = { id: result.insertId }
      res.status(201).json(newClient)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else if (req.method === 'PUT') {

    const { visitatecnica, descripcion, date, estado } = req.body;

    /* if (!visitatecnica || !descripcion || !date || !hora || !estado || !id) {
      return res.status(400).json({ error: 'ID, visitatecnica y descripción son obligatorios' })
    }
 */

    try {
      const [result] = await connection.query(
        'UPDATE visitatecnica SET visitatecnica = ?, descripcion = ?, date = ?,  estado = ? WHERE id = ?',
        [visitatecnica, descripcion, date, estado, id]
      )

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Visita técnica no encontrado' })
        }

        res.status(200).json({ message: 'Visita técnica actualizado correctamente' })
      } catch (error) {
        res.status(500).json({ error: error.message })
      }
  } else if (req.method === 'DELETE') {
    
    if (!id) {
      return res.status(400).json({ error: 'ID de de la visita técnica es obligatorio' })
    }

    else {
      // Eliminar la visita técnica por ID
      try {
        const [result] = await connection.query('DELETE FROM visitatecnica WHERE id = ?', [id])

        // Verificar si la visita técnica fue eliminado
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Visita técnica no encontrada' })
        }

        res.status(200).json({ message: 'Visita técnica eliminada correctamente' })
      } catch (error) {
        res.status(500).json({ error: error.message })
      }
    }

  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
