const express = require('express')
const { MongoClient } = require('mongodb');
var cors = require('cors')
require('dotenv').config()

const app = express()
const port = 5000

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

        // GET API
        app.get('/packages', async(req,res)=>{
            const cursor = packageCollection.find({});
            const products = await cursor.toArray();

            res.json(products)

        })

        // POST API
        app.post('/packages', async(req,res)=>{
            const package = req.body;
            console.log('post hit', package)
            const result = await packageCollection.insertOne(package)
            console.log(result)
            res.json(result)
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