import User from "../models/UserSchema.js";
import bcrypt from "bcrypt";

export const registerControllers = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    /* Check empty fields */
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter all fields",
      });
    }

    /* Password validation */
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain minimum 6 characters, including 1 uppercase, 1 lowercase, 1 number and 1 special character",
      });
    }

    /* Check if user already exists */
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    /* Hash password */
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    /* Create user */
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    /* Remove password before sending response */
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userResponse,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const loginControllers = async (req, res) => {
  try {
    const { email, password } = req.body;

    /* Check empty fields */
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter all fields",
      });
    }

    /* Find user */
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    /* Compare password */
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    /* Remove password before sending response */
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}`,
      user: userResponse,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};