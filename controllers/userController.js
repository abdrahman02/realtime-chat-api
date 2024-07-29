import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";

const createToken = (_id) => {
  const jwtKey = process.env.JWT_SECRET_KEY;

  return jwt.sign({ _id }, jwtKey, { expiresIn: "3d" });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await userModel.findOne({ email });

    if (user)
      return res
        .status(400)
        .json({ msg: "The email already exist", success: false });
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ msg: "All field are required", success: false });

    if (!validator.isEmail(email))
      return res
        .status(400)
        .json({ msg: "email must be a valid email", success: false });
    if (!validator.isStrongPassword(password))
      return res
        .status(400)
        .json({ msg: "Password must be a strong password", success: false });

    user = new userModel({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = createToken(user._id);

    return res
      .status(200)
      .json({ msg: "User created", success: true, data: user, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message, success: false });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await userModel.findOne({ email });

    if (!user)
      return res
        .status(400)
        .json({ msg: "Invalid email or password", success: false });

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      return res
        .status(400)
        .json({ msg: "Invalid email or password", success: false });

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
    }
    const token = createToken(user._id);

    return res
      .status(200)
      .json({ msg: "Login successfully", success: true, data: userData, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message, success: false });
  }
};

export const findUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await userModel.findById(userId);

    if (!user)
      return res.status(400).json({ msg: "User not found", success: false });

    return res
      .status(200)
      .json({ msg: "Find user successfully", success: true, data: user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message, success: false });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();

    if (!users)
      return res.status(400).json({ msg: "User not found", success: false });

    return res
      .status(200)
      .json({ msg: "Get user successfully", success: true, datas: users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message, success: false });
  }
};
