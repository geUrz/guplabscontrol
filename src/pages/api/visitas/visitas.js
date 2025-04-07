import { generateCode } from "@/helpers/generateCode/generateCode";
import connection from "@/libs/db";
import authMiddleware from "@/middlewares/authMiddleware"
import { isUserActive, isUserAdmin, hasPermission } from "@/libs/validations"
import QRCode from "qrcode";

const handlerWithAuth = authMiddleware(async (req, res) => {
    const { id, usuario_id, residencial_id, residente, search } = req.query;

    if (req.method === "GET") {
        try {
            let query = `
                SELECT
                    visitas.id,
                    visitas.usuario_id,
                    usuarios.nombre AS usuario_nombre,
                    usuarios.usuario AS usuario_usuario,
                    usuarios.privada AS usuario_privada,
                    usuarios.calle AS usuario_calle,
                    usuarios.casa AS usuario_casa,
                    visitas.codigo,
                    visitas.visita,
                    visitas.tipovisita,
                    visitas.tipoacceso,
                    visitas.nota,
                    visitas.date,
                    visitas.fromDate,
                    visitas.toDate,
                    visitas.hora,
                    visitas.estado,
                    visitas.dias,
                    visitas.countAcc,
                    visitas.autorizo,
                    visitas.autorizo_lector,
                    visitas.img1, visitas.img2, visitas.img3, visitas.img4, 
                    visitas.img5, visitas.img6, visitas.img7,
                    visitas.residencial_id,
                    visitas.updatedAt,
                    visitas.createdAt
                FROM visitas
                JOIN usuarios ON visitas.usuario_id = usuarios.id
            `;
    
            const params = [];
    
            // Filtro por usuario_id y residencial_id
            if (usuario_id && residencial_id) {
                query += " WHERE visitas.usuario_id = ? AND visitas.residencial_id = ? ORDER BY visitas.updatedAt DESC";
                params.push(usuario_id, residencial_id)
            }
            // Filtro solo por usuario_id
            else if (usuario_id) {
                query += " WHERE visitas.usuario_id = ? ORDER BY visitas.updatedAt DESC";
                params.push(usuario_id)
            }
            // Filtro solo por residencial_id
            else if (residencial_id) {
                query += " WHERE visitas.residencial_id = ? ORDER BY visitas.updatedAt DESC";
                params.push(residencial_id)
            }
            // Filtro por residente (usuario_id y tipo de visita "Residente")
            else if (residente) {
                query += " WHERE visitas.usuario_id = ? AND visitas.tipovisita = 'Residente' ORDER BY visitas.updatedAt DESC";
                params.push(residente)
            }
            // Filtro por búsqueda
            else if (search) {
                const searchQuery = `%${search.toLowerCase()}%`;
                query += ` WHERE LOWER(usuarios.nombre) LIKE ? 
                    OR LOWER(usuarios.privada) LIKE ? 
                    OR LOWER(usuarios.calle) LIKE ? 
                    OR LOWER(usuarios.casa) LIKE ? 
                    OR LOWER(visitas.visita) LIKE ? 
                    OR LOWER(visitas.codigo) LIKE ? 
                    OR LOWER(visitas.tipovisita) LIKE ? 
                    OR LOWER(visitas.tipoacceso) LIKE ? 
                    OR LOWER(visitas.fromDate) LIKE ? 
                    OR LOWER(visitas.toDate) LIKE ? 
                    OR LOWER(visitas.estado) LIKE ? 
                    OR LOWER(visitas.createdAt) LIKE ? 
                    ORDER BY visitas.updatedAt DESC`;
                params.push(searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery)
            } else {
                query += " ORDER BY visitas.updatedAt DESC";
            }
    
            // Ejecutar la consulta
            const [rows] = await connection.query(query, params)
    
            // Agregar el QR Code a cada visita
            const visitas = await Promise.all(rows.map(async (visita) => {
                const qrCode = await QRCode.toDataURL(visita.codigo)
                return { ...visita, qrCode };
            }))
    
            res.status(200).json(visitas)
        } catch (error) {
            res.status(500).json({ error: "Error al obtener las visitas" })
        }
    } 
    
    else if (req.method === "POST") {
        try {
  
            //hasPermission(req.user, "visitas")

            const { usuario_id, visita, tipovisita, tipoacceso, nota, date, fromDate, toDate, estado, dias, residencial_id } = req.body;
    
            if (!usuario_id || !visita || !tipovisita || !tipoacceso) {
                return res.status(400).json({ error: "Todos los datos son obligatorios" })
            }
    
            const code = generateCode() // Generar código nuevo
    
            if (tipovisita === "Residente") {
                // Buscar si ya existe una visita tipo Residente para el usuario
                const [existingVisit] = await connection.query(
                    "SELECT id FROM visitas WHERE usuario_id = ? AND tipovisita = 'Residente' LIMIT 1",
                    [usuario_id]
                )
    
                if (existingVisit.length > 0) {
                    // Actualizar la visita existente
                    const visitaId = existingVisit[0].id;
                    await connection.query(
                        "UPDATE visitas SET codigo = ?, fromDate = ?, toDate = ?, estado = ?, dias = ? WHERE id = ?",
                        [code, fromDate, toDate, estado, dias, visitaId]
                    )
    
                    // Insertar en la tabla reportevisitas
                    await connection.query(
                        "INSERT INTO reportevisitas (usuario_id, visita, tipovisita, tipoacceso, estado, fromDate, toDate, dias, residencial_id, action) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                        [usuario_id, visita, tipovisita, tipoacceso, estado, fromDate, toDate, dias, residencial_id, id, 'Actualizada']
                    )
                    
    
                    const qrCode = await QRCode.toDataURL(code)
                    return res.status(200).json({ id: visitaId, code, qrCode, message: "Código actualizado" })
                }
            }
    
            // Insertar nueva visita (para residentes si no existía o para visitas normales)
            const [result] = await connection.query(
                "INSERT INTO visitas (usuario_id, visita, tipovisita, tipoacceso, codigo, nota, date, fromDate, toDate, estado, dias, residencial_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [usuario_id, visita, tipovisita, tipoacceso, code, nota, date, fromDate, toDate, estado, tipoacceso === "frecuente" ? dias : null, residencial_id]
            )
    
            // Insertar en la tabla reportevisitas
            await connection.query(
                "INSERT INTO reportevisitas (usuario_id, visita, tipovisita, tipoacceso, date, fromDate, toDate, estado, dias, residencial_id, action) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [usuario_id, visita, tipovisita, tipoacceso, date, fromDate, toDate, estado, dias, residencial_id, 'Creada']
            )
            
    
            const qrCode = await QRCode.toDataURL(code)
            res.status(201).json({ id: result.insertId, code, qrCode, message: "Visita creada correctamente" })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } 
    
    else if (req.method === "PUT") {
        if (!id) {
            return res.status(400).json({ error: "ID de la visita es obligatorio" })
        }
    
        const { usuario_id, visita, tipovisita, tipoacceso, nota, date, fromDate, toDate, hora, estado, dias, residencial_id } = req.body;
    
        try {
            const [result] = await connection.query(
                "UPDATE visitas SET visita = ?, tipovisita = ?, tipoacceso = ?, nota = ?, date = ?, fromDate = ?, toDate = ?, hora = ?, estado = ?, dias = ? WHERE id = ?",
                [visita, tipovisita, tipoacceso, nota, date, fromDate, toDate, hora, estado, tipoacceso === "frecuente" ? dias : null, id]
            )
    
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Visita no encontrada" })
            }
    
            // Insertar en la tabla reportevisitas
            await connection.query(
                "INSERT INTO reportevisitas (usuario_id, visita, tipovisita, tipoacceso, date, fromDate, toDate, estado, dias, residencial_id, action) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [usuario_id, visita, tipovisita, tipoacceso, date, fromDate, toDate, estado, dias, residencial_id, 'Actualizada']
            )
    
            res.status(200).json({ message: "Visita actualizada correctamente" })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } 
    
    else if (req.method === "DELETE") {
        if (!id) {
            return res.status(400).json({ error: "ID de la visita es obligatorio" })
        }
    
        try {
            // Primero obtener los datos de la visita antes de eliminarla
            const [visitaData] = await connection.query(
                "SELECT * FROM visitas WHERE id = ?",
                [id]
            )
    
            if (visitaData.length === 0) {
                return res.status(404).json({ error: "Visita no encontrada" })
            }
    
            const visita = visitaData[0];
    
            // Ahora podemos insertar el registro en reportevisitas
            await connection.query(
                "INSERT INTO reportevisitas (usuario_id, visita, tipovisita, tipoacceso, date, fromDate, toDate, estado, dias, residencial_id, action) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    visita.usuario_id,  
                    visita.visita,      
                    visita.tipovisita,  
                    visita.tipoacceso,  
                    visita.date,        
                    visita.fromDate,    
                    visita.toDate,      
                    visita.estado,      
                    visita.dias,        
                    visita.residencial_id, 
                    'Eliminada'    
                ]
            )
    
            // Ahora eliminar la visita de la tabla visitas
            const [result] = await connection.query("DELETE FROM visitas WHERE id = ?", [id])
    
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Visita no encontrada" })
            }
    
            res.status(200).json({ message: "Visita eliminada correctamente" })
        } catch (error) {
            console.error(error)  // Para depuración
            res.status(500).json({ error: error.message })
        }
    } 
    
    else {
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
})

export default handlerWithAuth
