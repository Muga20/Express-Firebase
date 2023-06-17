"use strict";

const firebase = require("../config/db");
const firestore = firebase.firestore();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const createToken = (id, username, email) => {
  return jwt.sign({ id, username, email }, process.env.TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const registerUsers = async (req, res, next) => {
  try {
    const { username, email, password, name, phone, age } = req.body;

    // Generate a salt and hash the password
   
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = {
      name,
      phone,
      age,
      username,
      email,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Save the user to Firestore
    await firestore.collection("users").doc().set(user);

    const token = createToken(user.id, user.username, user.email);
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const logInUsers = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    // Query Firestore collection for the user's credentials
    const details = await firestore
      .collection("users")
      .where("email", "==", email)
      .get();

    if (details.empty) {
      // If no matching user is found, send an error response
      res.status(401).send("Invalid email or password");
    } else {
      // Retrieve the first matching user
      const user = details.docs[0].data();

      // Compare the hashed password with the provided password
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const token = createToken(user.id, user.username, user.email);
        res.status(200).json({ token });
      } else {
        // If the passwords don't match, send an error response
        res.status(401).send("Invalid email or password");
      }
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  logInUsers,
  registerUsers,
};
