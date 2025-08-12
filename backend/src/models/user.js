// import mongoose from 'mongoose';
// import bcrypt from "bcrypt";

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     phone: String,
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { timestamps: true }
// );
// // Pre-save middleware for hashing password
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next(); // Only hash if password is new or modified
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // Method to compare passwords
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// const User = mongoose.model('User', userSchema);

// export default User;

import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import Joi from "joi";

export const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      "string.empty": "Name is required",
      "string.min": "Name should have at least 2 characters",
      "string.max": "Name should not exceed 50 characters"
    }),
    email: Joi.string().email().required().messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email format"
    }),
    password: Joi.string().min(6).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password should be at least 6 characters long"
    }),
    phone: Joi.string()
      .pattern(/^[0-9]{10,15}$/)
      .optional()
      .messages({
        "string.pattern.base": "Phone number must be between 10 to 15 digits"
      })
  });

  return schema.validate(user);
};


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    phone: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash if password is new or modified
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
