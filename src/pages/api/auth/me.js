import jwt from 'jsonwebtoken'
import connection from '@/libs/db'
import { parse } from 'cookie'

export default async function meHandler(req, res) {
  try {
    const cookies = parse(req.headers.cookie || '')
    const token = cookies.myToken;

    if (!token) {
      return res.status(401).json({ error: 'No autenticado' })
    }

    const decoded = jwt.verify(token, 'secret')

    // Cambiar de JOIN a LEFT JOIN para permitir usuarios sin residencial_id
    const [rows] = await connection.query(`
      SELECT 
        usuarios.id, 
        usuarios.nombre, 
        usuarios.usuario, 
        usuarios.privada, 
        usuarios.calle, 
        usuarios.casa, 
        usuarios.email, 
        usuarios.isadmin, 
        usuarios.isactive, 
        usuarios.residencial_id, 
        residenciales.nombre AS nombre_residencial
      FROM 
        usuarios
      LEFT JOIN 
        residenciales ON usuarios.residencial_id = residenciales.id 
      WHERE 
        usuarios.id = ?
    `, [decoded.id])

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const user = rows[0];

    // Si el usuario no tiene residencial_id, devolver null para los campos relacionados con residenciales
    return res.json({ 
      user: { 
        id: user.id, 
        nombre: user.nombre, 
        usuario: user.usuario, 
        privada: user.privada || null, 
        calle: user.calle || null, 
        casa: user.casa || null, 
        email: user.email, 
        isadmin: user.isadmin, 
        isactive: user.isactive, 
        residencial_id: user.residencial_id || null,
        nombre_residencial: user.nombre_residencial || null 
      } 
    })
  } catch (error) {
    console.error('Error al obtener el usuario:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}
