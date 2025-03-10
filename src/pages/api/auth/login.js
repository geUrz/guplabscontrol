import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'
import connection from '@/libs/db'
import bcrypt from 'bcrypt'

export default async function loginHandler(req, res) {
  const { emailOrUsuario, password } = req.body

  try {
    console.log('Buscando usuario:', emailOrUsuario); // Depuración

    const [rows] = await connection.query(
      'SELECT * FROM usuarios WHERE email = ? OR usuario = ?', 
      [emailOrUsuario, emailOrUsuario]
    );

    if (rows.length === 0) {
      console.log('Usuario no encontrado'); // Depuración
      return res.status(401).json({ error: '¡ Correo o contraseña no existe !' })
    }

    const user = rows[0];
    console.log('Usuario encontrado:', user); // Depuración

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      console.log('Contraseña incorrecta'); // Depuración
      return res.status(401).json({ error: '¡ Correo o contraseña no existe !' })
    }

    // Si el usuario no es Admin y no tiene un residencial_id, lanzar error
    if (user.isadmin !== 'Admin' && !user.residencial_id) {
      console.log('Usuario sin residencial'); // Depuración
      return res.status(401).json({ error: 'El usuario debe estar asociado a un residencial' })
    }

    console.log('Generando token para:', user.usuario); // Depuración

    // Generar token de autenticación
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
        id: user.id,
        usuario: user.usuario,
        email: user.email,
      },
      'secret'
    );

    // Crear cookies
    const serialized = serialize('myToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, 
      path: '/'
    });

    const serializedUserId = serialize('userId', user.id.toString(), {
      httpOnly: false, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, 
      path: '/'
    });

    // Cookies adicionales para nombre y usuario
    const serializedUserName = serialize('userName', user.nombre, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30,
      path: '/'
    });

    const serializedUserUsername = serialize('userUsername', user.usuario, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30,
      path: '/'
    });

    // Establecer cookies en la respuesta
    res.setHeader('Set-Cookie', [serialized, serializedUserId, serializedUserName, serializedUserUsername]);
    
    // Respuesta con los datos del usuario
    return res.json({ user: { usuario: user.usuario, email: user.email, nombre: user.nombre } });
  } catch (error) {
    console.error('Error al autenticar el usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
