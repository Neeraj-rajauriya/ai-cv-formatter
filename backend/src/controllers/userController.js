// import User from '../models/user.js';
// import generateToken from '../../utils/generateToken.js';

// // REGISTER USER
// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, phone } = req.body;

//     // Check if user exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Create user (password will be hashed automatically in pre-save hook)
//     const user = await User.create({ name, email, password, phone });

//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       token: generateToken(user._id),
//     });
//   } catch (err) {
//     console.log("Error",err.message);
//     res.status(500).json({ message: err.message });
//   }
// };

// // LOGIN USER
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//      console.log("Inside login");
//     // Find user by email
//     const user = await User.findOne({ email });
//     if (!user) return res.status(401).json({ message: 'Invalid credentials' });

//     // Match password
//     const isMatch = await user.matchPassword(password);
//     if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

//     // Send token
//     res.status(200).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       token: generateToken(user._id),
//     });
//   } catch (err) {
//     console.error("Error:", err.message);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// // Add this to your existing userController.js
// // controllers/userController.js
// export const verifyToken = (req, res) => {
//   try {
//     console.log("Inside verify token");
//     if (!req.user) {
//       return res.status(401).json({
//         success: false,
//         message: 'User information not found in token'
//       });
//     }

//     res.status(200).json({ 
//       success: true,
//       user: {
//         id: req.user.id,
//         // Add other fields you include when generating the token
//       },
//       message: 'Token is valid'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error during token verification'
//     });
//   }
// };

import User, { validateUser } from '../models/user.js';
import generateToken from '../../utils/generateToken.js';
import Joi from "joi";

// Login validation schema
const loginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format"
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters"
  })
});


export const registerUser = async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).json({ errors: error.details.map(err => err.message) });
    }

    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, phone });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.log("Error", err.message);
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { error } = loginValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ errors: error.details.map(err => err.message) });
    }

    const { email, password } = req.body;
    console.log("Inside login");

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};


export const verifyToken = (req, res) => {
  try {
    console.log("Inside verify token");
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User information not found in token'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: req.user.id,
      },
      message: 'Token is valid'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during token verification'
    });
  }
};
