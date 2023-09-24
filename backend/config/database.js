import mysql from "mysql2";

//Create the connection to database
const db=mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "DarkKnight25$",
    database: "SampleDb"
});

export default db;