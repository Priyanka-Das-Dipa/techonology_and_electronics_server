const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mfd0sli.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const iphoneCollection = client.db("iPhoneDB").collection("iphone");
    const addCollection = client.db("iPhoneDB").collection("addToCart");

    // add and update product
    app.get("/iPhone", async (req, res) => {
      const cursor = iphoneCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post("/iPhone", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await iphoneCollection.insertOne(newProduct);
      res.send(result);
    });

    app.get("/iphone/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await iphoneCollection.findOne(query);
      res.send(result);
    });

    app.put("/iPhone/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProduct = req.body;
      const product = {
        $set: {
          name: updatedProduct.name,
          brandName: updatedProduct.brandName,
          price: updatedProduct.price,
          imageUrl: updatedProduct.imageUrl,
          type: updatedProduct.type,
          description: updatedProduct.description,
          rating_1: updatedProduct.rating_1,
        },
      };
      const result = await iphoneCollection.updateOne(filter, product, options);
      res.send(result);
    });

    // addToCard
    app.post("/addToCart", async (req, res) => {
      const addProduct = req.body;
      console.log(addProduct);
      
      const result = await addCollection.insertOne(addProduct);
      res.send(result);
    });
    app.get("/addToCart", async (req, res) => {
      const cursor = addCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});
app.listen(port, () => {
  console.log(`server is running in port ${port}`);
});
