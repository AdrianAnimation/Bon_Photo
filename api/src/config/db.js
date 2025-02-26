import mysql from "mysql2/promise";

const pool = mysql.createPool({
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	connectionLimit: 10, // limits the number of simultaneous database connections
	queueLimit: 0, // limits the number of connections waiting in queue
	waitForConnections: true, // determines if the pool should wait for an available connection before returning an error
});

pool.getConnection()
 	.then((connection) => {
		console.log("Connected to DB ", connection.config.database);
 		connection.release();
 	})
 	.catch((err) => {
 		console.log("Error connecting to DB: ", err);
 	});

export default pool;