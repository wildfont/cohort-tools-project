const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const Cohort = require("./mongoose_schema/cohort.model.js");
const Student = require("./mongoose_schema/student.model.js");

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://127.0.0.1:27017/cohorts-tools-api")
  .then((x) => console.log(`Connect to Database:"${x.connections[0].name}"`))

  .catch((err) => console.error("Error connecting to MongoDB", err));

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(cors());

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

//const cohorts = require("./cohorts.json")
app.get("/api/cohorts", async (req, res) => {
   try{
  const response = await Cohort.find()
  console.log(response)
 res.json(response)
 } catch (error) {
  console.log(error)
 }
});


app.post("/api/cohorts", (req, res) => {
  


console.log(req.body)


const newCohort = {
  inProgress: req.body.inProgress,
cohortSlug: req.body.cohortSlug,
cohortName: req.body.cohortName,
program: req.body.program,
campus: req.body.campus,
startDate: req.body.startDate,
endDate: req.body.endDate,
programManager: req.body.programManager,
leadTeacher: req.body.leadTeacher,
totalHours: req.body.totalHours 
}
Cohort.create(newCohort)
.then(() => {
  res.send("Cohort Created")
})
.catch((error) => {
  console.log(error)
})

})

app.get("/api/cohorts/:cohortId", async (req, res) => {
 try{
  const response = await Cohort.findById(req.params.cohortId)
  console.log(response)
 res.json(response)
 } catch (error) {
  console.log(error)
 }
})

app.put("/api/cohorts/:cohortId", async (req, res, next) => {

  console.log(req.params)
  console.log(req.body)

  try{

const updatedCohort = {
   inProgress: req.body.inProgress,
cohortSlug: req.body.cohortSlug,
cohortName: req.body.cohortName,
program: req.body.program,
campus: req.body.campus,
startDate: req.body.startDate,
endDate: req.body.endDate,
programManager: req.body.programManager,
leadTeacher: req.body.leadTeacher,
totalHours: req.body.totalHours 
  
}
const response = await Cohort.findByIdAndUpdate(req.params.cohortId, updatedCohort)

  res.send("cohort updated")
  } catch (error) {
    console.log(error)
  }
})


app.delete("/api/cohorts", async (req, res) => {
 try{
  const response = await Cohort.findByIdAndDelete(req.params.cohortId)
  console.log(response)
 res.json(response)
 } catch (error) {
  console.log(error)
 }
})

//const students = require("./students.json")
app.get("/api/students", async (req, res) => {
   try{
  const response = await Student.find()
  console.log(response)
 res.json(response)
 } catch (error) {
  console.log(error)
 }
});

app.post("/api/students", (req, res) => {
  

//1. we need to receive a body
console.log(req.body)
//2. we need to go into the db to create something

const newStudent = {
  firstName: req.body.firstName,
  lastName: req.body.lastName,
  email: req.body.email,
  phone: req.body.phone,
  linkedinUrl: req.body.linkedinUrl,
  languages: req.body.languages,
  program: req.body.program,
  background: req.body.background,
  image: req.body.image,
  projects: req.body.projects,
  cohort: req.body.cohort
  
}
Student.create(newStudent)
.then(() => {
  res.send("Student created")
})
.catch((error) => {
  console.log(error)
})

})

app.get("/api/students/:studentId", async (req, res) => {
 try{
  const response = await Student.findById(req.params.studentId).populate('cohort')
  console.log(response)
 res.json(response)
 } catch (error) {
  console.log(error)
 }
})

app.put("/api/students/:studentId", async (req, res, next) => {

  console.log(req.params)
  console.log(req.body)

  try{

const updatedStudent = {
    firstName: req.body.firstName,
  lastName: req.body.lastName,
  email: req.body.email,
  phone: req.body.phone,
  linkedinUrl: req.body.linkedinUrl,
  languages: req.body.languages,
  program: req.body.program,
  background: req.body.background,
  image: req.body.image,
  projects: req.body.projects,
 
  
}
const response = await Student.findByIdAndUpdate(req.params.studentId, updatedStudent)

  res.send("student updated")
  } catch (error) {
    console.log(error)
  }
})

app.get("/api/students/cohort/:cohortId", async (req, res, next) => {
  try{
    const studentsBelongCohort = await Student.find({cohort: req.params.cohortId}).populate('cohort')
    console.log("students belong to cohort")
    res.json(studentsBelongCohort)
  } catch (error) {
    console.log(error)
  }
})

app.delete("/api/students", async (req, res) => {
 try{
  const response = await Cohort.findByIdAndDelete(req.params.studentId)
  console.log(response)
 res.json(response)
 } catch (error) {
  console.log(error)
 }
})

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
