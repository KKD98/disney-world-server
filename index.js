const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rqhkoll.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toysCollection = client.db('toysServer').collection('toys');

    app.get('/alltoys' , async(req , res) => {
      const toys = toysCollection.find();
      const result = await toys.toArray();
      res.send(result);
    })

    app.get('/toysbycategory/:category' , async(req , res) => {
      const toys = toysCollection.find({category: req.params.category});
      const result = await toys.toArray();
      res.send(result);
    } )

    app.get('/singletoy/:id' , async(req , res) => {
      const id = req.params.id;
      const toy = {_id: new ObjectId(id)};
      const result = await toysCollection.findOne(toy);
      res.send(result);
    })

    app.post('/addtoy' , async(req , res) => {
      const newToy  = req.body;
      console.log(newToy)
      const result = await toysCollection.insertOne(newToy);
      res.send(result);
    })

    app.get('/toysbyemail/:email' , async(req , res) => {
      const toys = toysCollection.find({sellerEmail: req.params.email});
      const result = await toys.toArray();
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/' , (req , res) => {
    res.send('Toy Market Server is running')
})

app.listen(port , () => {
    console.log(`Toy Market Server is running on port: ${port}`);
})