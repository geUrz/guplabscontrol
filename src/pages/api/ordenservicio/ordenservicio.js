import connection from "@/libs/db"
import axios from "axios";

const ONE_SIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
const ONE_SIGNAL_API_KEY = process.env.NEXT_PUBLIC_ONESIGNAL_API_KEY;

// Función para enviar notificación solo a los admins
async function sendNotificationToAdmins(header, message, url) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${ONE_SIGNAL_API_KEY}`,
    };

    try {
        // Obtener los usuarios que son admin (isadmin = 'Admin') y tienen un onesignal_player_id no nulo
        const [users] = await connection.query(
            `SELECT onesignal_player_id 
            FROM usuarios 
            WHERE isadmin = 'Admin' 
            AND onesignal_player_id IS NOT NULL`
        );

        if (users.length === 0) {
            console.log('No se encontraron admins para enviar notificaciones.');
            return;
        }

        // Extraer los player_ids de los admins
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

        if (playerIds.length === 0) {
            console.log('No se encontraron player IDs válidos.');
            return;
        }

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
  const { id, residencial_id, search } = req.query

  if (req.method === 'GET') {

    if (residencial_id) {
      try {
        const [rows] = await connection.query(
          `SELECT
            ordenservicio.id,
            ordenservicio.usuario_id,
            ordenservicio.folio,
            usuarios.nombre AS usuario_nombre,
            usuarios.isadmin AS usuario_isadmin,
            ordenservicio.nombre,
            ordenservicio.descripcion,
            ordenservicio.date,
            ordenservicio.residencial_id,
            residenciales.nombre AS residencial_nombre,
            ordenservicio.nota,
            ordenservicio.firmaTec,
            ordenservicio.firmaCli,
            ordenservicio.folioref,
            ordenservicio.visitatecnica_id,
            ordenservicio.createdAt
          FROM ordenservicio
          JOIN usuarios ON ordenservicio.usuario_id = usuarios.id 
          JOIN residenciales ON ordenservicio.residencial_id = residenciales.id
          WHERE ordenservicio.residencial_id = ? 
          ORDER BY ordenservicio.updatedAt DESC`, [residencial_id]);
        
        
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

    if (search) {
      const searchQuery = `%${search.toLowerCase()}%`; // Convertimos la búsqueda a minúsculas
      try {
        const [rows] = await connection.query(
          `SELECT 
              ordenservicio.id,
              ordenservicio.usuario_id,
              ordenservicio.folio,
              usuarios.nombre AS usuario_nombre,
              usuarios.isadmin AS usuario_isadmin,
              ordenservicio.nombre,
              ordenservicio.descripcion,
              ordenservicio.date,
              ordenservicio.nota,
              ordenservicio.residencial_id,
              ordenservicio.firmaTec,
              ordenservicio.firmaCli,
              ordenservicio.visitatecnica_id,
              residenciales.nombre AS residencial_nombre,
              ordenservicio.folioref,
              ordenservicio.createdAt
              FROM ordenservicio
              JOIN usuarios ON ordenservicio.usuario_id = usuarios.id
              JOIN residenciales ON ordenservicio.residencial_id = residenciales.id
          WHERE 
            LOWER(ordenservicio.folio) LIKE ? 
            OR LOWER(ordenservicio.nombre) LIKE ? 
            OR LOWER(ordenservicio.descripcion) LIKE ?
            OR LOWER(ordenservicio.nota) LIKE ?
            OR LOWER(ordenservicio.date) LIKE ?
            ORDER BY ordenservicio.updatedAt DESC`,
          [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery]
        )

        /* if (rows.length === 0) {
          return res.status(404).json({ message: 'No se encontraron reportes' })
        } */

        res.status(200).json(rows)
      } catch (error) {
        res.status(500).json({ error: 'Error al realizar la búsqueda' })
      }
      return
    }

    // Caso para obtener todos las órdenes de servicio
    try {
      const [rows] = await connection.query(
        `SELECT
        ordenservicio.id,
        ordenservicio.usuario_id,
        ordenservicio.folio,
        usuarios.nombre AS usuario_nombre,
        usuarios.isadmin AS usuario_isadmin,
        ordenservicio.nombre,
        ordenservicio.descripcion,
        ordenservicio.date,
        ordenservicio.nota,
        ordenservicio.residencial_id,
        ordenservicio.firmaTec,
        ordenservicio.firmaCli,
        ordenservicio.visitatecnica_id,
        ordenservicio.folioref,
        ordenservicio.createdAt
    FROM ordenservicio
    JOIN usuarios ON ordenservicio.usuario_id = usuarios.id
    ORDER BY ordenservicio.updatedAt DESC
    `)
      res.status(200).json(rows)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else if (req.method === 'POST') {
    try {
      const { usuario_id, folio, nombre, descripcion, date, residencial_id, visitatecnica_id, folioref } = req.body;
      if (!usuario_id || !folio || !nombre || !descripcion) {
        return res.status(400).json({ error: 'Todos los datos son obligatorios' })
      }

      const [result] = await connection.query(
        'INSERT INTO ordenservicio (usuario_id, folio, nombre, descripcion, date, residencial_id, visitatecnica_id, folioref) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [usuario_id, folio, nombre, descripcion, date, residencial_id, visitatecnica_id, folioref]
      )

      const header = 'Órden de servicio';
      const message = `${nombre}`;
      const url = '/ordenesdeservicio';

      await sendNotificationToAdmins(header, message, url)

      const newClient = { id: result.insertId }
      res.status(201).json(newClient)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else if (req.method === 'PUT') {

    const { nombre, descripcion, date } = req.body;

    if (!nombre || !descripcion || !id) {
      return res.status(400).json({ error: 'ID, nombre y direccion son obligatorios' })
    }

    try {
      const [result] = await connection.query(
        'UPDATE ordenservicio SET nombre = ?, descripcion = ?, date = ? WHERE id = ?',
        [nombre, descripcion, date, id]
      )

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Órden de servicio no encontrado' })
        }

        res.status(200).json({ message: 'Órden de servicio actualizado correctamente' })
      } catch (error) {
        res.status(500).json({ error: error.message })
      }
  } else if (req.method === 'DELETE') {
    
    if (!id) {
      return res.status(400).json({ error: 'ID de la órden de servicio es obligatorio' })
    }

    else {
      // Eliminar la órden de servicio por ID
      try {
        const [result] = await connection.query('DELETE FROM ordenservicio WHERE id = ?', [id])

        // Verificar si la órden de servicio fue eliminado
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Reporte no encontrado' })
        }

        res.status(200).json({ message: 'Reporte eliminado correctamente' })
      } catch (error) {
        res.status(500).json({ error: error.message })
      }
    }

  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
