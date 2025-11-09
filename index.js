const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 3000 || process.env.PORT;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Freelance Market place backed server is on now ");
});

// Databse connection
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const uri =
//   "mongodb+srv://SkillHunt:EyTaVrBbPU1Y0iTK@cluster0.ijj1cbi.mongodb.net/?appName=Cluster0";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ijj1cbi.mongodb.net/?appName=Cluster0`;

//   MongoDb Client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    // creating databse name and collection
    const database = client.db("SkillHunt");
    const jobsCollection = database.collection("jobs");
    // get all the jobs
    app.get("/jobs", async (req, res) => {
      const cursore = jobsCollection.find();
      const result = await cursore.toArray();
      res.send(result);
    });

    // add a job
    app.post("/jobs", async (req, res) => {
      const newjob = req.body;
      const result = await jobsCollection.insertOne(newjob);
      res.send(result);
    });
    // get job by id
    app.get("/jobs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobsCollection.findOne(query);
      res.send(result);
    });
    // updata a job
    app.patch("/jobs/:id", async (req, res) => {
      const id = req.params.id;
      const updatedJob = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          name: updatedJob.name,
        },
      };
      const result = await jobsCollection.updateOne(query, update);
      res.send(result);
    });
    // delte a job
    app.delete("/jobs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobsCollection.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(` Application is listening on port${port} `);
});
