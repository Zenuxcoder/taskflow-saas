const Notification = require("../models/Notification")

const getNotification = async (req,res) => {

  try{

     const userId = req.user.Id;

     let notifications = await Notification.find({
            recipient:userId
           }).sort({createdAt : -1})
             .populate("actor" , "name email role")
             .populate("task" , "title priority status")

     return res.status(200).json({
        success:true,
        message:"Notifications fetched successfully",
        notifications
     })


  }

  catch(error){

    console.error(error)

    return res.status(500).json({
        success:false,
        message:"Internal server issue"
    })
  }


}

const markNotificationAsRead = async(req,res) => {

    try{
    const notificationId = req.params.notificationId
    const userId = req.user.id

    const notification = await Notification.findOne({
        _id:notificationId,
        recipient:userId,
    })

    if(!notification){
        return res.status(404).json({
            success:false,
            message:"Notification not found"
        })
    }

    notification.isRead = true

    await notification.save()

    return res.status(200).json({
        success:true,
        message:"Notification marked as read succesfully",
        notification
    })

  }

  catch(error){

     console.error(error)

     return res.status(500).json({
        success:false,
        message:"Internal server issue"
     })
  }
}

const markAllNotificationAsRead = async(req,res) => {

    try{

    const userId = req.user.id

    await Notification.updateMany({
        recipient:userId,
        isRead:false
    },
    {
        $set : {
             isRead : true
        }
    }
)

    return res.status(200).json({
        success:true,
        message:"All notifications marked as read successfull",
    })

  }

  catch(error){

     console.error(error)

     return res.status(500).json({
        success:false,
        message:"Internal server issue"
     })
  }
}

module.exports = {
     getNotification,
     markNotificationAsRead,
     markAllNotificationAsRead
}