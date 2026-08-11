const express = require("express")

const authMiddleware = require("../middleware/authMiddleware")

const{
    createTask,
    getAllTasks,
    getTask,
    updateTask,
    deleteTask
} = require("../controllers/taskController")

const router = express.Router()

router.post("/projects/:projectId",authMiddleware,createTask);

router.get("/projects/:projectId",authMiddleware,getAllTasks);

router.get("/projects/:projectId/:taskId",authMiddleware,getTask);

router.patch("/projects/:projectId/:taskId",authMiddleware,updateTask);

router.delete("/projects/:projectId/:taskId",authMiddleware,deleteTask);


module.exports = router