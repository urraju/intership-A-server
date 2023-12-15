const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
 const express = require('express')
 require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
 
app.use(cors())
  app.use(express.json());
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zrkwx23.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const  courseCollection = client.db("intership").collection("course");
   
    app.get('/course', async(req,res) => {
        const result = await courseCollection.find().toArray()
        res.send(result)
    })
    app.get("/course/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await courseCollection.findOne(filter);
        console.log(result);
        res.send(result);
      });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
     
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
    res.send("Server is Running");
  });
  app.listen(port, () => {
    console.log("Server is Running on PORT ||", port);
  });
  