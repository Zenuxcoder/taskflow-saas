const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({

  recipient:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  actor:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  type:{
    type:String,
    enum:[
        "TASK_ASSIGNED"
    ],
    required:true
  },

  task:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Task",
    required:true
  },

  isRead:{
    type:Boolean,
    default:false
  },

  message:{
    type:String,
    required:true
   }
 },

 {
  timestamps:true
 }
)

const Notification = mongoose.model("Notification",notificationSchema)

module.exports = Notification