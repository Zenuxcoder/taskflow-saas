const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createWorkspace,
       getWorkspaces,
       getWorkspaceById,
       updateWorkspace,
       deleteWorkspace,
       inviteMember,
       removeMember } = require("../controllers/workspaceController");
const router = express.Router();



router.post("/", authMiddleware, createWorkspace);

router.get("/", authMiddleware, getWorkspaces);

router.get("/:workspaceId", authMiddleware, getWorkspaceById);

router.patch("/:workspaceId", authMiddleware, updateWorkspace);

router.delete("/:workspaceId", authMiddleware, deleteWorkspace);

router.patch("/:workspaceId/members", authMiddleware, inviteMember);

router.patch("/:workspaceId/members/remove", authMiddleware, removeMember);


module.exports = router