const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9jswbtf.mongodb.net/?retryWrites=true&w=majority`;

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

    // await client.connect();

    const foodCollection = client.db('foodDB').collection('foods');

    app.get('/foods', async (req, res) => {
      const cursor = foodCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/foods/:id', async (req, res,) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const options = {

        projection: { _id: 1, name: 1, img: 1, quantity: 1, expires: 1 }
      }
      const result = await foodCollection.findOne(query, options);
      res.send(result);
    })

    app.get('/foods', async (req, res) => {
      const cursor = foodCollection.find();
      const food = await cursor.toArray();
      res.send(food);
    })

    app.post('/foods', async (req, res) => {
      const data = req.body;
      console.log(data);

      const result = await foodCollection.insertOne(data);
      res.send(result);
    })


    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Community Food Sharing Server Is Running');
})

app.listen(port, () => {
  console.log(`Server Is Running On Port ${port}`);
})