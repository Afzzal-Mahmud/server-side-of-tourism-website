const { MongoClient } = require('mongodb')
/* sequre password by dotenv package */
require('dotenv').config()

const express = require('express')
const app = express()
const port = 5000

/* use middlewere */
const cors = require('cors')
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@node-express-crud.gezbh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        /* home page of the server */
        app.get('/',(req,res) =>{
            res.send('welcome to the server side')
        })

        await client.connect();
        const database = client.db("adventureTurisom");
        const offersCollection = database.collection("offerCollectionList")
        /* add a colection what user order */
        const orderCollection = database.collection("orderCollectionList")

        /* sending offerData to server */
        app.post('/offers',async (req,res) =>{
            const offers = req.body
            console.log('hitting the post',offers)
            const result = await offersCollection.insertOne(offers)
            console.log(result)
            res.json(result)
        })

        /* getting application data from mongoDb database */
        app.get('/alloffers',async(req,res) =>{
            const cursor = offersCollection.find({})
            const allOffers = await cursor.toArray()
            res.send(allOffers)
        })

        /* add order collection to database */
        app.post('/order',async (req,res) =>{
            const order = req.body;
            console.log(orderCollection)
            console.log('hitting the order',order)
            const result = await orderCollection.insertOne(order)
            res.send(result)
        })
        /* getting allUser order to the database */
        // app.get('/userorder'async (req,res) =>{
        //     const orderCursor = orderCollection.find({})

        // })
        console.log('connecting to database')
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir)

app.listen(port,() =>{
    console.log('listening to the port',port)
})
