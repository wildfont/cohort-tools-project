try {
  process.loadEnvFile()
} catch(error) {
  console.warn(".env file not found, using default environment values")
}


const express = require("express")
const router = express.Router()


router.get("/test", (req, res, next) => {
  
  console.log(req.body)
  console.log(req.query) 
  console.log(req.params) 

  res.status(200).json({ message: "all good here!" })
})


const studentRoutes = require("./student.routes.js")
router.use("/students", studentRoutes)

const cohortRoutes = require("./cohort.routes.js")
router.use("/cohorts", cohortRoutes)

const authRoutes = require("./auth.routes.js")
router.use("/auth", authRoutes)

module.exports = router