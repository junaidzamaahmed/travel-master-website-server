const express = require('express')
const { MongoClient } = require('mongodb');
var cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xk9pn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

    try {

        await client.connect();
        console.log('mongodb connected')
        const database = client.db("tripMaster");
        const packageCollection = database.collection("packages")
        const orderCollection = database.collection("orders")

        // GET API
        app.get('/packages', async (req, res) => {
            const cursor = packageCollection.find({});
            const packages = await cursor.toArray();
            res.json(packages)
        })

        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const bookings = await cursor.toArray();
            res.json(bookings)
        })

        // FIND SPECIFIC DATA API
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const pkg = await packageCollection.findOne(query);
            res.send(pkg)
        })


        // ADD PACKAGE API
        app.post('/packages', async (req, res) => {
            const package = req.body;
            const result = await packageCollection.insertOne(package)
            res.json(result)
        })

        // ORDERS API
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order)
            res.json(result)
        })

        // MY ORDERS API
        app.get('/orders/:userID', async (req, res) => {
            const userID = req.params.userID;
            const query = { userID: userID }
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray()
            res.send(orders)
        })

        // Approve ORDER API
        app.put('/approve/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: true
                },
            };
            const result = await orderCollection.updateOne(filter, updateDoc, options);
            res.json(result)
        })

        // Delete ORDER API
        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result)
        })

    } finally {

        //   await client.close();

    }

}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})