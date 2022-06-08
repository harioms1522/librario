/* eslint-disable prettier/prettier */
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Need a name"],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid Email"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Password is must!"],
    minLength: [8, "You need 8 letters for a password"],
  },
  confirmPassword: {
    type: String,
    required: [true, " Confirm password is must!"],
    // This will only work when save and create
    validate: {
      validator: function(elem) {
        return elem === this.password;
      },
      message: "Passwords don't match!",
    },
  },
});

// instance method
// we can not get the password so we are using both here
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.pre("save", async function(next) {
  //   use hashing only is the password is being changed
  if (!this.isModified("password")) return next();

  //   Hash the passwrd and we get it encrypted
  this.password = await bcrypt.hash(this.password, 12);

  //   We only need the confirmPassword field to just check if the password is correct
  this.confirmPassword = undefined;

  next();
});

const User = mongoose.model("User", userSchema);

// exporting the model
module.exports = User;
