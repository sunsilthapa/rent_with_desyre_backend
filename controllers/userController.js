const Users = require("../model/userModel");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

//todo: register
const createUser = async (req, res) => {
  // step 1 : Check if data is coming or not
  console.log(req.body);

  // step 2 : Destructure the data
  const { fullName, email, password } = req.body;

  // step 3 : validate the incoming data
  if (!fullName  || !email || !password) {
    return res.json({
      success: false,
      message: "Please enter all the fields.",
    });
  }

  // step 4 : try catch block
  try {
    // step 5 : Check existing user
    const existingUser = await Users.findOne({ email: email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists.",
      });
    }

    // password encryption
    const randomSalt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, randomSalt);

    // step 6 : create new user
    const newUser = new Users({
      // fieldname : incomming data name
      fullName: fullName,
      email: email,
      password: encryptedPassword,
    });

    // step 7 : save user and response
    await newUser.save();
    res.status(200).json({
      success: true,
      message: "User created successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
};


//todo: login 
const loginUser = async (req, res) => {
  try {
    console.log(req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Please enter all fields.",
      });
    }

    const user = await Users.findOne({email:email});
    console.log(user);

    if (!user) {
      return res.json({
        success: false,
        message: "User does not exist.",
      });
    }

    const databasePassword = user.password;
    const isMatched = await bcrypt.compare(password, databasePassword);

    if (!isMatched) {
      return res.json({
        success: false,
        message: "Invalid Credentials.",
      });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      success: true,
      message: "User logged in successfully.",
      token: token,
      userData: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

//todo: get user by id
const getUserById = async (req, res) => {
  const { userId } = req.params; // Retrieve userId from request parameters

  try {
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      message: "User found successfully",
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

//todo: change password
const changePassword = async (req, res) => {
  try {
    console.log(req.body);
    const { oldPassword, newPassword, userId } = req.body;

    const user = await Users.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const isMatched = await bcrypt.compare(oldPassword, user.password);

    if (!isMatched) {
      return res.json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newHashedPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

//todo: forgot password
const forgotPassword = async (req, res) => {
  //*desstructuring
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Please enter your email address",
    });
  }

  try {
    //* check existing user
    const user = await Users.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    //* create a token
    const secret = process.env.JWT_SECRET + user.password;
    const token = jwt.sign({ email: user.email }, secret, { expiresIn: "15m" });

    //* create a link
    const link = `http://localhost:5000/api/user/reset-password/${user._id}/${token}`;

    //* send email thorough nodemailer
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sunsil1281@gmail.com",
        pass: "odpxtfekzroqdfdh",
      },
    });

    //* mail options and send mail
    var mailOptions = {
      from: "sunsil1281@gmail.com",
      to: email,
      subject: "Password Reset Link",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent:" + info.response);
      }
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

//todo: update password link check
const updatePasswordLinkCheck = async (req, res) => {
  //* get id and token from params
  const { id, token } = req.params;

  //* if id or token is not provided
  const oldUser = await Users.findOne({ _id: id });
  if (!oldUser) {
    return res.status(404).json({
      message: "User does not exist",
    });
  }

  //* verify token
  const secret = process.env.JWT_SECRET + oldUser.password;
  try {
    // Render the index.ejs template and pass the id and token variables
    const verify = jwt.verify(token, secret);
    if (verify) {
      res.render("index", { id: id, token: token, email: verify.email });
    }
  } catch (e) {
    res.status(500).json("Password reset link not verified");
  }
};

//todo: update password link check
const updatePassword = async (req, res) => {
  //* get id and token from params
  const { id, token } = req.params;

  //* get password from body
  const {password } = req.body;

  //* find user
  const oldUser = await Users.findOne({ _id: id });
  //* if user does not exists
  if (!oldUser) {
    return res.status(404).json({
      message: "User does not exist",
    });
  }

  //* verify token
  const secret = process.env.JWT_SECRET + oldUser.password;
  try {
    const encryptedPassword = await bcrypt.hash(password, 10);
    await Users.updateOne(
      { _id: id },
      { $set: { password: encryptedPassword } }
    );
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (e) {
    res.status(500).json("Password reset failed");
  }
};


const updateUserProfile = async (req, res) => {
  const userId = req.params.userId;
  const { fullName, email } = req.body;

  try {
    let user = await Users.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if profile image is provided in the request
    if (req.files && req.files.profileImage) {
      const { profileImage } = req.files;
      // Upload image to Cloudinary
      const result = await cloudinary.v2.uploader.upload(profileImage.path, {
        folder: 'users',
        crop: 'scale'
      });
      // Save the image URL from Cloudinary
      user.profileImage = result.secure_url;
    }

    // Update user data fields
    user.fullName = fullName;
    user.email = email;

    // Save the updated user data
    user = await user.save();

    res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


//todo: get all users
const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await Users.find();

    console.log(users);

    // Check if any users are found
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found.",
      });
    }

    // Return the list of users
    res.status(200).json({
      success: true,
      users: users,
    });
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  changePassword,
  forgotPassword,
  updatePasswordLinkCheck,
  updatePassword,
  updateUserProfile,
  getAllUsers,
  getUserById
};
