const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: function(origin, callback) {
        const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173", "http://localhost:5174"];
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Allow explicitly defined origins or any vercel preview URL dynamically
        if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }
        callback(new Error("Not allowed by CORS"));
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

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    console.error("Unhandled Exception:", err.stack);
    const status = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
});

module.exports = app
