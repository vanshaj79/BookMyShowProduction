const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", async (req, res) => {
  try {
    const user = req.body;
    const userExists = await User.findOne({ email: user.email });

    if (userExists) {
      return res.send({
        success: false,
        message: "User with this email already exists in DB",
      });
    }

    const salt = await bcrypt.genSalt(10);
    // here salt is nothing but adding 10 special characters after your password value
    // so that to provide more security to hashed passowrd
    const hashedPassword = await bcrypt.hash(user.password, salt);
    //overrriding hashed password
    const newUser = new User({ ...user, password: hashedPassword });
    newUser.save();

    res.send({
      success: true,
      message: "User Successfully Registered",
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  
  if (!user) {
    return res.send({
      success: false,
      message: "User does not exist",
    });
  }

  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isValidPassword) {
    return res.send({
      success: false,
      message: "Incorrect Password",
    });
  }

  // jwt.sign(payload, secretkey)
  const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, {
    expiresIn: "10d",
  });

  return res.send({
    success: true,
    message: "User is Logged in",
    data: token,
  });
});

//protected route
router.get("/currentUser", authMiddleware, async (req, res) => {
  try {
    const userId = req.body.userId;
    //finding user by mongoose model
    const user = await User.findOne({_id: userId});
    //console.log(user,"user")

    if (!user) {
      return res.send({
        success: false,
        message: "User not found",
      });
    }
    return res.send({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    res.send({
      success:false,
      message:"something went wrong"
    })
  }
});

exports.router = router;
