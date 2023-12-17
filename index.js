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
    const   userCourseeCollection = client.db("intership").collection("userCourse");
   
    app.get('/course', async(req,res) => {
        const filter = req.query
        const query = {
          name: { $regex: filter.search || "" },
        };
        const result = await courseCollection.find(query).toArray()
        res.send(result)
    })
    app.get("/course/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await courseCollection.findOne(filter);
        console.log(result);
        res.send(result);
      });
      app.patch("/course/update", async (req, res) => {
        const id = req.query.id;
        console.log(id);
        const filter = { _id: new ObjectId(id) };
  
        const pathData = {
          $inc: {
            like: +1,
          },
        };
        const result = await courseCollection.updateOne(filter, pathData);
        console.log(result);
        res.send(result);
      });
      // user course buy api 
      app.post('/userCourse', async (req,res) => {
        const query = req.body
        const result = await userCourseeCollection.insertOne(query)
        res.send(result)
      })
      app.get("/userCourse", async (req, res) => {
        const query = req.query?.email
        const filter = {userEmail : query}
        console.log('email',query);
        const result = await userCourseeCollection.find(filter).toArray();
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
  