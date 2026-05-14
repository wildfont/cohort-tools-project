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
app.use(
  cors({
    origin: process.env.ORIGIN,
  }),
);

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
  try {
    const response = await Cohort.find();
    res.status(200).json(response);
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/cohorts", (req, res) => {
  console.log(req.body);

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
    totalHours: req.body.totalHours,
  };
  Cohort.create(newCohort)
    .then(() => {
      res.send("Cohort Created");
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const response = await Cohort.findById(req.params.cohortId);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

app.put("/api/cohorts/:cohortId", async (req, res, next) => {
  console.log(req.params);
  console.log(req.body);

  try {
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
      totalHours: req.body.totalHours,
    };
    const response = await Cohort.findByIdAndUpdate(
      req.params.cohortId,
      updatedCohort,
    );

    res.status(202).send("cohort updated");
  } catch (error) {
    next(error);
  }
});

app.delete("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const response = await Cohort.findByIdAndDelete(req.params.cohortId);
    res.status(202).json(response);
  } catch (error) {
    next(error);
  }
});

//const students = require("./students.json")
app.get("/api/students", async (req, res) => {
  try {
    const response = await Student.find().populate("cohort");
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

app.post("/api/students", (req, res) => {
  //1. we need to receive a body
  console.log(req.body);
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
    cohort: req.body.cohort,
  };
  Student.create(newStudent)
    .then(() => {
      res.sendStatus(201);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/api/students/:studentId", async (req, res) => {
  try {
    const response = await Student.findById(req.params.studentId).populate(
      "cohort",
    );
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

app.put("/api/students/:studentId", async (req, res, next) => {
  console.log(req.params);
  console.log(req.body);

  try {
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
    };
    const response = await Student.findByIdAndUpdate(
      req.params.studentId,
      updatedStudent,
    );

    res.sendStatus(202).send("student updated");
  } catch (error) {
    next(error);
  }
});

app.get("/api/students/cohort/:cohortId", async (req, res, next) => {
  try {
    const studentsBelongCohort = await Student.find({
      cohort: req.params.cohortId,
    }).populate("cohort");
    res.status(200).json(studentsBelongCohort);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/students/:studentId", async (req, res) => {
  try {
    const response = await Student.findByIdAndDelete(req.params.studentId);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// error handling for 404 errors
app.use((req, res) => {
  res.status(404).json({ errorMessage: "Sorry, route not found" });
});

// error handling for 500 errors
app.use((error, req, res, next) => {
  // express know this is the 500 error handler just because it has 4 parameters.
  console.log(error);
  res
    .status(500)
    .json({ errorMessage: "something went BOOM, sorry about this" });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
