const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
    getNotification,
    markNotificationAsRead,
    markAllNotificationAsRead
} = require("../controllers/notificationController");

const router = express.Router();

router.get("/",authMiddleware,getNotification);

router.patch("/:notificationId/read",authMiddleware,markNotificationAsRead);

router.patch("/read-all",authMiddleware, markAllNotificationAsRead);


module.exports = router;