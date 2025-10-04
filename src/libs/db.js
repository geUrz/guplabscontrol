import mysql from 'mysql2/promise';

// Configura la conexión a la base de datos
const connection  = mysql.createPool({
  host: 'localhost',   
  user: 'root',           
  password: 'adm1nsql1',  
  database: 'guplabscontrol', 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default connection  

