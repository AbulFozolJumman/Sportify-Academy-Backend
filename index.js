const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Default Get
app.get("/", (req, res)=> {
    res.send("Sportify Academy Server is Running")
})

// Port
app.listen(port, ()=> {
    console.log(`Server is running on port: ${port}`)
})