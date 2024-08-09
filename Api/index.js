const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const User = require("./Models/User.js");
const Place = require("./Models/Place.js");
const imageDownloader = require("image-downloader");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const app = express();
const jwtsecret = "sdfghjewtrwyehdfjrasytahsjdwyqwidaxhjksx";

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.get("/test", (req, res) => {
  res.json("test okay");
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const bcryptSalt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);

    const userDoc = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json(userDoc);
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDoc = await User.findOne({ email });
    if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
        jwt.sign(
          { email: userDoc.email, id: userDoc._id, name: userDoc.name },
          jwtsecret,
          {},
          (err, token) => {
            if (err) throw err;
            res.cookie("token", token).json(userDoc);
          }
        );
      } else {
        res.status(422).json("Password not okay");
      }
    } else {
      res.status(404).json("User not found");
    }
  } catch (error) {
    res.status(500).json({ error: "Error logging in user" });
  }
});

app.get("/profile", (req, res) => {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, jwtsecret, {}, (err, user) => {
      if (err) {
        console.error(err);
        res.status(401).json({ error: "Invalid token" });
      } else {
        res.json(user);
      }
    });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/upload-by-link", async (req, res) => {
  try {
    const { link } = req.body;
    const newName = "photo" + Date.now() + ".jpeg";
    const dest = path.join(__dirname, "uploads", newName);

    await imageDownloader.image({
      url: link,
      dest: dest,
    });

    res.json(newName);
  } catch (error) {
    console.error("Error downloading image:", error);
    res.status(500).json({ error: "Failed to download image" });
  }
});

const photosMiddleware = multer({ dest: "uploads/" });

app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];

  for (let i = 0; i < req.files.length; i++) {
    const { path: tempPath, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = tempPath + "." + ext;

    fs.renameSync(tempPath, newPath);

    uploadedFiles.push(path.basename(newPath));
  }

  res.json(uploadedFiles);
});

app.post("/places", (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  jwt.verify(token, jwtsecret, {}, async (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    const placeDoc = await Place.create({
      owner: user.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });
    res.json(placeDoc);
  });
});

app.get("/user-places", (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  jwt.verify(token, jwtsecret, {}, async (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    const { id } = user;
    try {
      const places = await Place.find({ owner: id });
      res.json(places);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve places" });
    }
  });
});

app.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  try {
    const place = await Place.findById(id);
    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }
    res.json(place);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/places", async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const {
    _id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  if (!_id) {
    return res.status(400).json({ error: "Place ID is required" });
  }

  jwt.verify(token, jwtsecret, {}, async (err, user) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }

    const userId = user.id;

    console.log("Decoded JWT User Object:", user);
    console.log(`User ID: ${userId}`);

    try {
      const placeDoc = await Place.findById(_id);
      if (!placeDoc) {
        return res.status(404).json({ error: "Place not found" });
      }

      console.log(`Place Owner ID: ${placeDoc.owner.toString()}`);

      if (userId !== placeDoc.owner.toString()) {
        return res.status(403).json({ error: "Forbidden: Not the owner" });
      }

      placeDoc.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });

      await placeDoc.save();
      res.json("ok");
    } catch (error) {
      console.error("Internal Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
});

app.get("/places", async (req, res) => {
  res.json(await Place.find());
});

app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
