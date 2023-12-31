const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0ztfqf2.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    // DB Collections
    const usersCollection = client.db("Sportify-Academy").collection("users");
    const classesCollection = client.db("Sportify-Academy").collection("classes");

    // Get all Classes data
    app.get('/classes', async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await classesCollection.find(query).toArray();
      res.send(result);
    })

    // Get top 6 classes based on the number of students
    app.get('/topClasses', async (req, res) => {
      const result = await classesCollection.find()
        .sort({ students: -1 }) // Sort in descending order based on the number of students
        .limit(6) // Limit the result to 6 classes
        .toArray();
      res.send(result);
    });

    // Get class by _id
    app.get('/class/:id', async (req, res) => {
      const { id } = req.params;
      try {
        const toy = await classesCollection.findOne({ _id: new ObjectId(id) });
        if (!toy) {
          return res.status(404).json({ error: 'Toy not found' });
        }
        res.json(toy);
      } catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
      }
    });

    // Add a class
    app.post('/classes', async (req, res) => {
      const addedClass = req.body;
      const result = await classesCollection.insertOne(addedClass);
      res.send(result);
    });

    // Get all users data and get users data by role
    app.get('/users', async (req, res) => {
      let query = {};
      if (req.query?.role) {
        query = { role: req.query.role }
      }
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    })

    // Get user data by email
    app.get('/user', async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    })

    // Add user while signup
    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email }
      const existingUser = await usersCollection.findOne(query);

      if (existingUser) {
        return res.send({ message: 'user already exists' })
      }

      const result = await usersCollection.insertOne(user);
      res.send(result);
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// Default Get
app.get("/", (req, res) => {
  res.send("Sportify Academy Server is Running")
})

// Port
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})