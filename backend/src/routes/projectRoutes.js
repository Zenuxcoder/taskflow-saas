const express = require("express")
const authMiddleware = require("../middleware/authMiddleware");
const {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject

} = require("../controllers/projectController");

const router = express.Router()

router.post("/workspaces/:workspaceId" , authMiddleware , createProject)

router.get("/workspaces/:workspaceId" , authMiddleware , getProjects)

router.get("/:projectId" , authMiddleware , getProject)

router.patch("/:projectId" , authMiddleware , updateProject)

router.delete("/:projectId" , authMiddleware , deleteProject)

module.exports = router