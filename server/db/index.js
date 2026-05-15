const mongoose = require("mongoose")



// :information_source: Connects to MongoDB using the URI from environment variables.

  
//const MONGO_URI = "mongodb://127.0.0.1:27017/cohort-tools-api";async ()
  
async function connectDB () {

if(mongoose.connection.readyState === 1)
{return 
try {
const response = await mongoose.connect(process.env.MONGODB_URI);
const dbName = response.connections[0].name;
console.log(`Connected to Mongo! Database name: "${dbName}"`);
} catch (err) {
console.error("Error connecting to mongo: ", err);
}
}
 
mongoose
  .connect(MONGO_URI)
  .then((x) => console.log(`Connect to Database:"${x.connections[0].name}"`))

  .catch((err) => console.error("Error connecting to MongoDB", err));




 
}


module.exports = connectDB


