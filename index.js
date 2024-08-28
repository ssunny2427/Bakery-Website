import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/Cluster99", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define the Mongoose schema
const orderSchema = new mongoose.Schema({
  name1: { type: String, unique: true },
  name2: String,
  name3: String,
});

const suggestionSchema = new mongoose.Schema({
  sname: String,
});

// Define the Mongoose models
const Order = mongoose.model("Order", orderSchema, "order");
const Suggestion = mongoose.model("Suggestion", suggestionSchema, "suggestions");

function checkName(req, res, next) {
  req.body.name1 = req.body.username;
  req.body.name2 = req.body.passwords;
  req.body.name3 = req.body.emails;
  next();
}

app.get("/menu", (req, res) => {
  res.sendFile(__dirname + "/menu.html");
});

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/suggestion", (req, res) => {
  res.sendFile(__dirname + "/suggestions.html");
});

app.get("/login", async (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.get("/logout", async (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/catering", async (req, res) => {
  res.sendFile(__dirname + "/catering.html");
});

app.get("/index", async (req, res) => {
  res.sendFile(__dirname + "/home.html");
});

app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/about.html");
});

app.get("/register", async (req, res) => {
  res.sendFile(__dirname + "/register.html");
});

app.get("/payment", (req, res) => {
  res.sendFile(__dirname + "/payment.html");
});

app.get("/contact", (req, res) => {
  res.sendFile(__dirname + "/contact.html");
});

app.post("/submit", checkName, async (req, res) => {
  try {
    const { name1, name2, name3 } = req.body;
    const existingOrder = await Order.findOne({ name1 }).exec();
    if (existingOrder) {
      // Data already exists in the database, redirect to login page
      res.redirect("/login");
    } else {
      // Data doesn't exist in the database, redirect to register page
      res.redirect("/register");
    }
  } catch (error) {
    console.error("Error checking order:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/register", checkName, async (req, res) => {
  try {
    const { name1, name2, name3 } = req.body;
    const existingOrder = await Order.findOne({ name1 }).exec();
    if (existingOrder) {
      // Data already exists in the database, redirect to login page
      res.redirect("/login");
    } else {
      const order = new Order({ name1, name2, name3 });
      await order.save();
      console.log("Order saved successfully");
      res.redirect("/login");
    }
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/suggestion", async (req, res) => {
  try {
    const { useData } = req.body;
    const newData = new Suggestion({ sname:useData });
    await newData.save();
    res.send("Data saved successfully");
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).send("An error occurred while saving data.");
  }
});

// app.post("/suggestion", async (req, res) => {
//   try {
//     const { useData } = req.body; // Correctly extract useData
//     const newData = new Suggestion({ sname: useData }); // Use useData for sname
//     await newData.save();
//     res.send("Data saved successfully");
//   } catch (error) {
//     console.error("Error saving data:", error);
//     res.status(500).send("An error occurred while saving data.");
//   }
// });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
