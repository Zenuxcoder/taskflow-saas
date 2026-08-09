const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema({

   name:{
    type:String,
    require:true,
   },

   description:{
    type:String,
   },
    
   workspace:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Workspace",
      require:true
   },

   owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    require:true
   }


},

{

    timestamps:true

}
)

const Project = mongoose.model("Project",projectSchema)

module.exports = Project