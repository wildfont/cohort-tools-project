const router = require("express").Router()

const User = require("../models/user.models.js")

const bcrypt = require("bcryptjs")

// POST "/api/auth/signup" => creates the user document
router.post("/signup", async (req, res, next) => {

  // email, username, password
  console.log(req.body)
  const { email, username, password } = req.body

  // both email and password are mandatory
  if (!email || !password) {
    res.status(400).json({errorMessage: "Both email and password are mandatory"})
    return // this means, stop executing the route
  }
  
  // password strong enough
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm

  if (passwordRegex.test(password) === false) {
    res.status(400).json({errorMessage: "Password is not strong enough. It needs at least 8 characters, one uppercase, one lowercase and one number"})
    return // this means, stop executing the route
  }
  
  // email format should be correct. xxx-@xxx-.xx-
  // ... done finding the proper regex

  // extra security (sending an email for email verification). Use packages like nodemailer, mailchimp and brevo.
  
  try {
    // email should be unique
    const foundUser = await User.findOne({ email: email }) // either the user or null
    if (foundUser) {
      res.status(400).json({errorMessage: "user already created with that email"})
      return // this means, stop executing the route
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    
    //... create the user
    const newUser = {
      email: email,
      username: username,
      password: hashedPassword
    }

    const response = await User.create(newUser)

    res.sendStatus(201)
  } catch (error) {
    next(error)
  }
})







module.exports = router