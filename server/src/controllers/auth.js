import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const existingUser = await User.findOne({ email: email });
    console.log(`existingUser: ${existingUser}`);

    if (existingUser) {
      return res.status(400).json({ msg: "Email already exists." })
    };

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    const savedUser = await newUser.save();
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);
    res.status(201).json({token, user: savedUser});
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailClean = email.toLowerCase();
    const user = await User.findOne({ email: emailClean });
    if (!user) {
      return res.status(400).json({ msg: "User not found." });
    }

    console.log(`bcrypt.compare(${password}, ${user.password})`)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials. " });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/**
 * @function reloadUser
 * @param {Request} req 
 * @param {Response} res 
 * @returns Updated user
 */
export const reload = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({ msg: "User not found." });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
