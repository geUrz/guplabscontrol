import connection from '@/libs/db'; // Asegúrate de importar la configuración de la base de datos
import bcrypt from 'bcrypt';

export default async function registerHandler(req, res) {
  const { nombre, usuario, privada, calle, casa, email, isadmin, residencial_id, password } = req.body;

  try {
    // Verificar si el usuario o el correo ya están registrados
    const [existingUser] = await connection.query(
      'SELECT * FROM usuarios WHERE email = ? OR usuario = ?', 
      [email, usuario]
    );

    if (existingUser.length > 0) {
      if (existingUser[0].email === email) {
        return res.status(400).json({ error: '¡ El correo ya está registrado !' });
      }
      if (existingUser[0].usuario === usuario) {
        return res.status(400).json({ error: '¡ El usuario ya está registrado !' });
      }
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardar el nuevo usuario en la base de datos
    const [result] = await connection.query(
      'INSERT INTO usuarios (nombre, usuario, privada, calle, casa, email, isadmin, residencial_id, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nombre, usuario, privada, calle, casa, email, isadmin, residencial_id, hashedPassword]
    );

    // Devolver una respuesta exitosa
    return res.status(201).json({ message: 'Usuario registrado exitosamente', userId: result.insertId });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
