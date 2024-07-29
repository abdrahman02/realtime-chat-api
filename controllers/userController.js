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
    const { name, email, password, confPassword } = req.body;

    let errors = [];

    let user = await userModel.findOne({ email });

    if (!name || !email || !password || !confPassword)
      errors.push("All field are required");

    if (!validator.isEmail(email)) errors.push("email must be a valid email");

    if (user) errors.push("The email already exist");

    if (password !== confPassword) errors.push("Password is do not match");

    if (!validator.isStrongPassword(password))
      errors.push("Password must be a strong password");

    if (errors.length > 0)
      return res.status(400).json({ errors, success: false });

    user = new userModel({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    return res.status(200).json({
      msg: "User created, you can login now",
      success: true,
      data: user,
    });
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
    };
    const token = createToken(user._id);

    return res.status(200).json({
      msg: "Login successfully",
      success: true,
      data: userData,
      token,
    });
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
