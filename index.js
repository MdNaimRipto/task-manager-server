const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express")
const app = express()
const cors = require("cors")
const port = process.env.PORT || 5000
require("dotenv").config()

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ltefwui.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        const descriptionCollection = client.db("taskManager").collection("tasks")

        // Tasks section

        app.get('/tasks', async (req, res) => {
            const email = req.query.email
            const query = { email: email, completed: false }
            const result = await descriptionCollection.find(query).toArray()
            res.send(result)

        })

        app.get('/completedTasks', async (req, res) => {
            const email = req.query.email
            const query = { email: email, completed: true }
            const result = await descriptionCollection.find(query).toArray()
            res.send(result)

        })

        app.put("/completedTasks/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateTaskStatus = {
                $set: {
                    completed: false
                }
            }
            const result = await descriptionCollection.updateOne(filter, updateTaskStatus, options)
            res.send(result)
        })

        app.get("/updateTask/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await descriptionCollection.findOne(query)
            res.send(result)
        })

        app.put("/updatedTask/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updatedTask = req.body
            const updatedDoc = {
                $set: {
                    description: updatedTask.task
                }
            }
            const result = await descriptionCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })

        app.post('/tasks', async (req, res) => {
            const task = req.body;
            const result = await descriptionCollection.insertOne(task)
            res.send(result)
        })

        app.put("/tasks/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateTaskStatus = {
                $set: {
                    completed: true
                }
            }
            const result = await descriptionCollection.updateOne(filter, updateTaskStatus, options)
            res.send(result)
        })

        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await descriptionCollection.deleteOne(query)
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(err => console.error(err))

app.get("/", (req, res) => {
    res.send("Task Manager Working Successfully")
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})