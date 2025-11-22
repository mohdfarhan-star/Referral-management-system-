const express = require('express')
const app = express()
const database = require('./config/database');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const fileUpload = require("express-fileupload");
const {cloudinaryConnect} = require('./config/cloudinary')
const candidateRoutes = require("./routes/candidateRoutes")
const authRoutes = require("./routes/authRoutes")

// setting port
const PORT = process.env.PORT || 4000;

// loading env variables from .env
dotenv.config();

// db connection
database.connect();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: "https://portfolio-pvx3.vercel.app",
		credentials: true,
	})
);
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);

//cloudinary connect
cloudinaryConnect();

app.use("/api/v1/candidates", candidateRoutes);
app.use("/api/v1/auth", authRoutes);

app.get('/', (req, res) => {
  return res.json({
    success:true,
    message:"Your servers is up and running"
  });
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
