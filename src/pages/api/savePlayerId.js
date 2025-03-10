/* import connection from '@/libs/db'

export default async function savePlayerId(req, res) {
  const { playerId, userId } = req.body;

  if (!playerId || !userId) {
    return res.status(400).json({ error: 'Player ID y User ID son requeridos' });
  }

  try {
    // Verificar si el Player ID ya está registrado para este usuario en la tabla `player_ids`
    const [existingPlayer] = await connection.query(
      'SELECT * FROM player_ids WHERE user_id = ? AND player_id = ?',
      [userId, playerId]
    );

    if (existingPlayer.length > 0) {
      return res.status(200).json({ message: 'El Player ID ya está registrado' });
    }

    // Si el Player ID no existe, agregarlo a la tabla `player_ids`
    await connection.query(
      'INSERT INTO player_ids (user_id, player_id) VALUES (?, ?)',
      [userId, playerId]
    );

    // Actualizar el campo `onesignal_player_id` en la tabla `usuarios` con el último Player ID
    await connection.query(
      'UPDATE usuarios SET onesignal_player_id = ? WHERE id = ?',
      [playerId, userId]
    );

    return res.status(200).json({ message: 'Player ID registrado y usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error al guardar Player ID:', error.message);
    return res.status(500).json({ error: 'Error al guardar Player ID' });
  }
}
 */

import connection from '@/libs/db';

export default async function savePlayerId(req, res) {
  const { playerId, userId } = req.body;

  if (!playerId || !userId) {
    return res.status(400).json({ error: 'Player ID y User ID son requeridos' });
  }

  try {
    // Verificar si el Player ID ya está registrado para este usuario en la tabla `player_ids`
    const [existingPlayer] = await connection.query(
      'SELECT * FROM player_ids WHERE user_id = ? AND player_id = ?',
      [userId, playerId]
    );

    if (existingPlayer.length > 0) {
      return res.status(200).json({ message: 'El Player ID ya está registrado' });
    }

    // Si el Player ID no existe, agregarlo a la tabla `player_ids`
    await connection.query(
      'INSERT INTO player_ids (user_id, player_id) VALUES (?, ?)',
      [userId, playerId]
    );

    // Obtener los player_id actuales de la tabla usuarios
    const [rows] = await connection.query(
      'SELECT onesignal_player_id FROM usuarios WHERE id = ?',
      [userId]
    );

    let currentPlayerIds = rows[0].onesignal_player_id ? rows[0].onesignal_player_id.split(',') : [];

    // Verificar si el nuevo playerId ya está en la lista
    if (!currentPlayerIds.includes(playerId)) {
      currentPlayerIds.push(playerId); // Agregar el nuevo playerId
    }

    // Actualizar los playerIds concatenados en la columna onesignal_player_id
    await connection.query(
      'UPDATE usuarios SET onesignal_player_id = ? WHERE id = ?',
      [currentPlayerIds.join(','), userId]
    );

    return res.status(200).json({ message: 'Player ID registrado y usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error al guardar Player ID:', error.message);
    return res.status(500).json({ error: 'Error al guardar Player ID' });
  }
}
