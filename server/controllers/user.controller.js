import { User } from "../model/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: "1w" });
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const { name, date_of_birth, city, state, gender, email, password } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send("Email already registered");

    const newUser = new User({
      name,
      email,
      password,
      gender,
      date_of_birth,
      city,
      state,
    });

    const user = await newUser.save();

    res.status(201).json({ message: `User created successfully`, user });
  } catch (error) {
    console.log("createUser error:", error.message);
    res.status(500).send("Internal server error");
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Password does not match");

    const token = generateToken(user._id);

    res.status(200).json({ token, user });
  } catch (error) {
    console.log("login error:", error.message);
    res.status(500).send("Internal server error");
  }
};

// Fetch user data
const fetchUserData = async (req, res) => {
  try {
    let { id } = req.params;

    // If it's `/me`, the middleware already put the user in req.user
    if (!id || id === "me") {
      return res.status(200).json({ user: req.user });
    }

    // Otherwise fetch by ID
    const user = await User.findById(id);
    if (!user) return res.status(404).send("User not found");

    user.password = undefined;
    res.status(200).json({ user });
  } catch (error) {
    console.log("fetchUserData error:", error.message);
    res.status(500).send("Internal server error");
  }
};
export { createUser, login, fetchUserData };
