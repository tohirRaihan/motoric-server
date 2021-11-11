const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tqvty.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function run() {
    try {
        await client.connect();
        const database = client.db('motoric');
        const carCollection = database.collection('cars');
        const orderCollection = database.collection('orders');

        // --------------------------Cars API--------------------------
        // GET cars
        app.get('/cars', async (req, res) => {
            const cursor = carCollection.find({});
            const cars = await cursor.toArray();
            res.send(cars);
        });

        // Find one car by id
        app.get('/cars/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await carCollection.findOne(query);
            res.send(result);
        });

        // ---------------------------Orders API---------------------------
        // CREATE order
        app.post('/orders', async (req, res) => {
            console.log(req.body);
            const newOrder = req.body;
            console.log(newOrder);
            const result = await orderCollection.insertOne(newOrder);
            res.json(result);
        });

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
