const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");

require("dotenv").config();

// middle ware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lnnhqxo.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

async function run() {
  try {
    const applicantInfoCollection = client
      .db("internTaskDb")
      .collection("applicantInfo");

    app.post("/applicant", upload.single("cvFile"), async (req, res) => {
      let info = req.body;
      console.log(info, req.file);
      info["cv_link"] = req.file.path;
      info["track_id"] = Math.floor(Math.random() * 90000);
      const result = await applicantInfoCollection.insertOne(info);
      res.send(result);
    });

    app.get("/applicant/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await applicantInfoCollection.findOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch((error) => console.log(error.message));

app.get("/", async (req, res) => {
  res.send("server created");
});
app.listen(port, () => {
  console.log("server running on port", port);
});
