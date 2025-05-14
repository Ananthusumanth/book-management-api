const express = require('express')
const cors = require("cors")
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const {v4: uuidv4} = require("uuid")
const app = express()
app.use(express.json())
app.use(cors())

let db = null
const dbPath = path.join(__dirname, 'crudDatabase.db')

const initlizDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server is running in http://localhost:3000')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initlizDBAndServer()

app.get("/books", async (request, response) => {
    const getQueryDetails = `
        SELECT * FROM books
        `
    const dbUser = await db.all(getQueryDetails)
    response.send(dbUser)
})

app.get("/books/:id", async (request, response) => {
    const {id} = request.params
    const getQueryDetails = `
        SELECT * FROM books WHERE ID = ${id}
        `
    const dbUser = await db.all(getQueryDetails)
    response.send(dbUser)
})

app.post("/books", async (request, response) => {
    const {title, author, publishedYear} = request.body
    const createUserDetails = `
    INSERT INTO books (ID, TITLE, AUTHOR, PUBLISHEDYEAR)
    VALUES (
        '${uuidv4()}',
        '${title}',
        '${author}',
        '${publishedYear}'
    )
    `
    await db.run(createUserDetails)
    const success = 'Successfully Added Book'
    response.status(200)
    response.send({success})
  })

  app.put("/books/:id", async (request, response) => {
    const {id} = request.params
    const {title, author, publishedYear} = request.body
    const updatePasswordDetails = `
    UPDATE books
    SET 
    TITLE = '${title}',
    AUTHOR = '${author}',
    PUBLISHEDYEAR = '${publishedYear}'
    WHERE ID = ${id}
    `
    await db.run(updatePasswordDetails)
    const success = 'Book Updated Successfully'
    response.status(200)
    response.send({success})
  })

  app.delete("/books/:id", async (request, response) => {
    const {id} = request.params
    const getDetails = `
    DELETE FROM books WHERE ID = ${id}
    `
    await db.run(getDetails)
    const success = "Book deleted successfully"
    response.status(200)
    response.send({success})

  })

  module.export = app