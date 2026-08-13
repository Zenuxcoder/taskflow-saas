require("dotenv").config();

const express = require ("express")
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

const PORT = (process.env.PORT);

const healthRoutes = require("./routes/healthRoutes")

const authRoutes = require("./routes/authRoutes")

const workspaceRoutes = require("./routes/workspaceRoutes");

const projectRoutes = require("./routes/projectRoutes")

const taskRoutes = require("./routes/taskRoutes")

const commentRoutes = require("./routes/commentRoutes")

const app = express()

app.use(express.json())

app.use(cookieParser());

app.use("/" ,healthRoutes)

app.use("/api/auth" ,authRoutes)

app.use("/api/workspaces", workspaceRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/comments", commentRoutes)

connectDB()

app.listen(PORT, ()=> {
    console.log("server is running on port", {PORT} )
});