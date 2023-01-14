require("dotenv").config()
console.clear()
const express = require("express")
const app = express()
const cors = require("cors")
const { MongoClient } = require("mongodb")
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const client = new MongoClient(process.env.DB, { useNewUrlParser: true })

async function run() {
  try {
    await client.connect()
    const database = client.db("doctor_portal")
    const appointmentsCollection = database.collection("appointments")
    const userCollection = database.collection("users")

    app.get("/appointments", async (req, res) => {
      const email = req.query.email
      const date = new Date(req.query.date).toLocaleDateString()
      console.log(date)
      const query = {
        "initialInfo.email": email,
        date,
      }
      console.log(query)
      const cursor = appointmentsCollection.find(query)
      const appointments = await cursor.toArray()
      res.json(appointments)
    })

    app.post("/appointments", async (req, res) => {
      const appointment = req.body
      console.log(appointment)
      const results = await appointmentsCollection.insertOne(appointment)

      res.json(results)
    })

    app.post("/users", async (req, res) => {
      const user = req.body
      const results = await userCollection.insertOne(user)
      console.log(results)
      res.json(results)
    })
  } finally {
    //await client.close();
  }
}
run().catch(console.dir)

app.get("/", (req, res) => {
  res.send("Hello Doctors portals")
})

app.listen(port, () => {
  console.log(`https://localhost:${port}/`)
})

/* app.get('/users')
app.post('/users')
app.get('/users/:id')
app.post('/users/:id')
app.delete('/users/:id') */
