const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())
const allowedOrigins = [
    process.env.CLIENT_URL || "http://localhost:5173"
]

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true
}))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

app.get("/", (req, res) => {
    res.send("Backend is Running !!!")
})

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "success",
        backend: "healthy",
        timestamp: new Date().toISOString()
    });
})

app.get("/health/db", (req, res) => {
    const mongoose = require("mongoose");
    const dbState = mongoose.connection.readyState;
    const statusText = {
        0: "disconnected",
        1: "connected",
        2: "connecting",
        3: "disconnecting"
    };

    res.status(200).json({
        status: "success",
        database: statusText[dbState] || "unknown",
        timestamp: new Date().toISOString()
    });
})

module.exports = app
