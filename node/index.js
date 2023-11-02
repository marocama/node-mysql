const mysql = require('mysql')
const dotenv = require('dotenv')
const express = require('express')

dotenv.config()

const app = express(), port = 3000

// Função para executar uma query no banco de dados
async function query(sql) {
  const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })

  const promise = new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) { reject(err) } 
      else { resolve(result) }
    })
  })

  const result = await promise
  connection.end()
  
  return result
}

const init = async () => {
  // Verifica se tabela de usuários já existe
  await query(`CREATE TABLE IF NOT EXISTS users(id int NOT NULL AUTO_INCREMENT, name varchar(255) NOT NULL, PRIMARY KEY(id))`)

  app.listen(port, () => console.log('Rodando na porta: ' + port))
  
  app.get('/', async (req, res) => {
    // Adiciona mais um registro
    await query(`INSERT INTO users(name) values('Marcus')`)
    // Busca pelos registros existentes
    const users = await query(`SELECT * FROM users`)
  
    res.send(`
      <h1>Node + MySQL</h1>\n\n
      <ul>
        ${ users.map(i => `<li>${i.name}</li>`).join('') }
      </ul>
    `)
  })
}


init()