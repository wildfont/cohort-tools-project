try {
  process.loadEnvFile()
} catch(error) {
  console.warn(".env file not found, using default environment values")
}

//TODO ask Jorge about PORT not defined

const express = require("express")
const User = require("./models/user.models.js")


const app = express();
const config = require("./config")
config(app)

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...
 
const connectDB = require("./db")
app.use( async (req, res, next) => {
await connectDB()
next()

} )

const indexRouter = require("./routes/index.routes.js")
app.use("/api", indexRouter)

const errorHandling = require("./errors")
errorHandling(app)





// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

//const cohorts = require("./cohorts.json")





// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
