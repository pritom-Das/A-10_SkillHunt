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
const { MongoClient, ServerApiVersion } = require("mongodb");
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

    app.get("/jobs", async (req, res) => {
      const cursore = jobsCollection.find();
      const result = await cursore.toArray();
      res.send(result);
    });

    app.post("/jobs", async (req, res) => {
      const newjob = req.body;
      const result = await jobsCollection.insertOne(newjob);
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
