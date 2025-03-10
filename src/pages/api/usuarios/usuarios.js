import connection from "@/libs/db"
import bcrypt from "bcrypt"

export default async function handler(req, res) {
    const { id, isadmin, search } = req.query;

    if (req.method === 'GET') {

        if (search) {
            const searchQuery = `%${search.toLowerCase()}%`
            
            // Convertir 'Activo' a 1 y 'Inactivo' a 0
            let isActiveQuery = null;
            if (search.toLowerCase() === "activo") {
                isActiveQuery = 1;
            } else if (search.toLowerCase() === "inactivo") {
                isActiveQuery = 0;
            }
        
            try {
                const query = `
                    SELECT  
                        usuarios.id,
                        usuarios.folio, 
                        usuarios.nombre, 
                        usuarios.usuario, 
                        usuarios.privada, 
                        usuarios.calle, 
                        usuarios.casa, 
                        usuarios.email, 
                        usuarios.isadmin,
                        usuarios.isactive, 
                        usuarios.residencial_id, 
                        residenciales.nombre AS residencial_nombre
                    FROM 
                        usuarios
                    LEFT JOIN 
                        residenciales ON usuarios.residencial_id = residenciales.id
                    WHERE LOWER(usuarios.nombre) LIKE ? 
                    OR LOWER(usuarios.folio) LIKE ? 
                    OR LOWER(usuarios.usuario) LIKE ? 
                    OR LOWER(usuarios.privada) LIKE ? 
                    OR LOWER(usuarios.calle) LIKE ? 
                    OR LOWER(usuarios.casa) LIKE ? 
                    OR LOWER(usuarios.email) LIKE ? 
                    OR LOWER(CAST(usuarios.isactive AS CHAR)) LIKE ?
                    OR LOWER(residenciales.nombre) LIKE ?  
                    ${isActiveQuery !== null ? "OR usuarios.isactive = ?" : ""}
                    ORDER BY usuarios.updatedAt DESC`;
        
                const params = [
                    searchQuery, searchQuery, searchQuery, searchQuery, 
                    searchQuery, searchQuery, searchQuery, searchQuery, 
                    searchQuery
                ];
        
                if (isActiveQuery !== null) {
                    params.push(isActiveQuery);
                }

                /* if (rows.length === 0) {
                    return res.status(404).json({ message: 'No se encontraron usuarios' })
                } */
        
                const [rows] = await connection.query(query, params);
                res.status(200).json(rows);
        
            } catch (error) {
                res.status(500).json({ error: 'Error al realizar la búsqueda' });
            }
            return;
        }
        

        if (isadmin) {

            const isadminValues = isadmin.split(',').map(value => value.trim())

            try {
                const [rows] = await connection.query(
                    `SELECT 
                        usuarios.id, 
                        usuarios.folio, 
                        usuarios.nombre, 
                        usuarios.usuario, 
                        usuarios.privada, 
                        usuarios.calle, 
                        usuarios.casa, 
                        usuarios.email, 
                        usuarios.isadmin,
                        usuarios.isactive, 
                        usuarios.residencial_id, 
                        residenciales.nombre AS residencial_nombre
                        FROM usuarios 
                        LEFT JOIN 
                        residenciales ON usuarios.residencial_id = residenciales.id
                        WHERE isadmin IN (?)`,
                    [isadminValues]
                );

                /* if (rows.length === 0) {
                    return res.status(404).json({ error: 'Usuario no encontrado' });
                } */

                res.status(200).json(rows);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        }

        if (id) {
            try {
                const [rows] = await connection.query(
                    'SELECT id, nombre, usuario, privada, calle, casa, email, isadmin, isactive, residencial_id FROM usuarios WHERE id = ?',
                    [id]
                );

                /* if (rows.length === 0) {
                    return res.status(404).json({ error: 'Usuario no encontrado' });
                } */

                res.status(200).json(rows[0]);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        } else {
            try {
                const [rows] = await connection.query(
                    `SELECT 
                        usuarios.id, 
                        usuarios.folio, 
                        usuarios.nombre, 
                        usuarios.usuario, 
                        usuarios.privada, 
                        usuarios.calle, 
                        usuarios.casa, 
                        usuarios.email, 
                        usuarios.isadmin,
                        usuarios.isactive, 
                        usuarios.residencial_id, 
                        residenciales.nombre AS residencial_nombre
                    FROM 
                        usuarios
                    LEFT JOIN 
                        residenciales ON usuarios.residencial_id = residenciales.id
                    ORDER BY 
                        usuarios.updatedAt DESC`
                );
                res.status(200).json(rows);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        }
    } else if (req.method === 'POST') {
        // Crear un nuevo usuario
        const { folio, nombre, usuario, privada, calle, casa, email, isadmin, isactive, residencial_id, password } = req.body;

        if (!password) {
            return res.status(400).json({ error: 'Se requiere una contraseña' });
        }

        try {
            // Encriptar la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            const [result] = await connection.query(
                `INSERT INTO usuarios (folio, nombre, usuario, privada, calle, casa, email, isadmin, isactive, residencial_id, password)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [folio, nombre, usuario, privada, calle, casa, email, isadmin, isactive, residencial_id, hashedPassword]
            );

            res.status(201).json({ id: result.insertId, folio, nombre, usuario, privada, calle, casa, email, isadmin, isactive, residencial_id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'PUT') {
        // Actualizar un usuario existente
        if (!id) {
            return res.status(400).json({ error: 'ID del usuario es necesario para actualizar' });
        }

        const { nombre, usuario, privada, calle, casa, email, isadmin, isactive, residencial_id } = req.body;

        try {
            const [result] = await connection.query(
                `UPDATE usuarios 
                 SET nombre = ?, usuario = ?, privada = ?, calle = ?, casa = ?, email = ?, isadmin = ?, isactive = ?, residencial_id = ?
                 WHERE id = ?`,
                [nombre, usuario, privada, calle, casa, email, isadmin, isactive, residencial_id, id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            res.status(200).json({ id, nombre, usuario, privada, calle, casa, email, isadmin, isactive, residencial_id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
