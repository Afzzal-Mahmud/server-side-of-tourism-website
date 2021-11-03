const { MongoClient } = require('mongodb')
/* sequre password by dotenv package */
require('dotenv').config()

const express = require('express')
const app = express()
const port =process.env.PORT || 5000
/* use middlewere */
const cors = require('cors')
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@node-express-crud.gezbh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        
        await client.connect();
        const database = client.db("adventureTurisom");
        const offersCollection = database.collection("offerCollectionList")
        /* add a colection what user order */
        const orderCollection = database.collection("orderCollectionList")
        
        /* getting room data to databse */
        const roomCollection = database.collection("hotelRooms")

        /* sending offerData to server */
        app.post('/offers',async (req,res) =>{
            const offers = req.body
            console.log('hitting the post',offers)
            const result = await offersCollection.insertOne(offers)
            res.json(result)
        })

        /* getting application data from mongoDb database */
        app.get('/alloffers',async(req,res) =>{
            const cursor = offersCollection.find({})
            const allOffers = await cursor.toArray()
            res.json(allOffers)
        })
        
        /* add offersOrder collection to database */
        app.post('/order',async (req,res) =>{
            const order = req.body;
            console.log('hitting the order',order)
            const result = await orderCollection.insertOne(order)
            res.json(result)
        })

        /* recive offers from orderCollection to database */
        app.get('/useroffer/:email', async(req,res) =>{
            const email = req.params.email;
            const result = await orderCollection.find({email}).toArray()
            console.log(result,'from email')
            res.send(result)
        })

        /* getting roomData to the database */
        app.get('/userorder',async (req,res) =>{
            const cursor = roomCollection.find({})
            const allRooms = await cursor.toArray()
            res.send(allRooms)
        })

        // deleting order data
        app.delete('/deleteorder/:key', async (req, res) => {
            const key = req.params.key;
            console.log(key)
            const query = { key: key };
            const result = await orderCollection.deleteOne(query);
            console.log(result)
            res.json(result);
        })
        /* delete all order to shipping components */
        app.delete('/deleteall', async (req, res) => {
            const query = { detail: "order" };
            const result = await orderCollection.deleteMany(query);
            console.log(result)
            res.json(result);
        })
        
        console.log('connecting to database')
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir)

/* home page of the server */
app.get('/',(req,res) =>{
    res.send('welcome to the server side')
})
app.listen(port,() =>{
    console.log('listening to the port',port)
})
