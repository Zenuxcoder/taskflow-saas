const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({

   title:{
    type:String,
    required:true
   },

   description:{
    type:String
   },

   project:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Project",
    required:true,
   },

   createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
   },

   assignedTo:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
   },

   status:{
    type:String,
    enum:["TODO","IN_PROGRESS","DONE"],
    default:"TODO"
   },

   priority:{
    type:String,
    enum:["MEDIUM","LOW","HIGH"],
    default:"MEDIUM"
   },

   dueDate:{
    type:Date
   },

},


   {
    timestamps:true
   }

)

const Task = mongoose.model("Task",taskSchema)

module.exports = Task