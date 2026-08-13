const express =  require("express")

const authMiddleware = require("../middleware/authMiddleware")

const {
    createComment,
    getComments,
    updateComment,
    deleteComment   
          } = require("../controllers/commentController")

const router = express.Router()

router.post("/tasks/:taskId",authMiddleware,createComment);

router.get("/tasks/:taskId",authMiddleware,getComments);

router.patch("/tasks/:taskId/:commentId",authMiddleware,updateComment);

router.delete("/tasks/:taskId/:commentId",authMiddleware,deleteComment);


module.exports = router