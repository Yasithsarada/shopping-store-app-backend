const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 4000;
const sql = require("mssql");
// const { dbConnectionClose, dbConnect } = require("./config/db.config");
// const { addProduct } = require("./controller/product");
// const crypto = require("crypto");
const mongoose = require("mongoose");
require("dotenv").config();
MONGO_DB_URL = `mongodb+srv://wkabeyratne0:${process.env.MONGO_DB_PASSWORD}@cluster0.t5fimht.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`


app.use(express.json());
app.use(cors());

const productRouter = require("./routes/product_Router");
const categoryRouter = require("./routes/category");
const userRoute = require("./routes/user_Router");
const Post = require("./model/post");

app.use("/api/products", productRouter);
app.use("/api/auth", userRoute);
app.use("/api/category", categoryRouter);

// async function executeQuery() {
//   await dbConnect();
//   try {
//     const result = await sql.query `INSERT INTO Users (userId, username, email, password)
//     VALUES
//       (${id}, 'john_doe', 'john@example.com', 'pass123')`;
//     console.log('Query result:', result.recordset);

//   } catch (err) {
//     console.error('Error executing query:', err.message);
//   } finally {
//         // Close the connection after the query is executed (optional)
//         dbConnectionClose();
//       }
// }

// Call the executeQuery function to execute a query
// executeQuery();
// Start the server
app.post("/hey", async (req, res) => {    return res.json("hiiiiiiiiii" )})
app.post("/posts/create", async (req, res) => {
  try {
    const { title, body, slug } = req.body;
    const post = await Post.create({ title, body, slug});
    if (!post) throw new Error;
  
    if (!post) {
      return res.status(404).json({
        message: "Post not found!",
      });
    }
  
    res.status(200).json( post);
    //An extra console response never hurts!
    return console.log(post);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
});

app.get("/:posts/:slug", async (req, res) => {
  const posts = await Post.findById(req.params.posts);

  if (!posts) {
    return res.status(404).json({
      message: "Post not found!",
    });
  }

  res.status(200).json({
    title: posts.title,
    body: posts.body,
  });
  //An extra console response never hurts!
  return console.log(posts);
});

mongoose
  .connect(MONGO_DB_URL)
  .then(() => console.log("Database connecteed"));
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
