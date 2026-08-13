const Project = require("../models/Project");
const Task = require("../models/Tasks");
const Workspace = require("../models/Workspace")
const Comment = require("../models/Comment")

const createComment = async (req,res)  => {
 
    try{

     const taskId = req.params.taskId;
     const userId = req.user.id ;
     let content = req.body.content

    if(!content){
        return res.status(400).json({
            success:false,
            message:"Enter some content"
        })
    }

    content = content.trim()

    if(content === ""){
        return res.status(400).json({
            success:false,
            message:"Enter some content"
        })
    }

    const task = await Task.findById(taskId)

    if(!task){
        return res.status(404).json({
            success:false,
            message:"Task not found"
        })
    }
 
    const project = await Project.findById(task.project)

    if(!project){
        return res.status(404).json({
            success:false,
            message:"Project not found"
        })
    }

    const workspace = await Workspace.findOne({
        _id:project.workspace,
        members:userId
    })

    if(!workspace){
        return res.status(404).json({
            success:false,
            message:"Workspace not found"
        })
    }

    const comment = await Comment.create({
        task : taskId,
        createdBy : userId,
        content:content
    })

    return res.status(201).json({
        success:true,
        message:"Comment created successfully",
        comment
    })
   }

 catch(error){

    console.log(error)

    return res.status(500).json({
        success:false,
        message:"Internal server issue"
    })
   }
 
}

const getComments = async (req,res) =>{

    try{
   const userId = req.user.id;
   const taskId = req.params.taskId;
   
   const task = await Task.findById(taskId)

   if(!task){
    return res.status(404).json({
        success:false,
        message:"task not found"
    })
   }

   const project = await Project.findById(task.project)

   if(!project){
    return res.status(404).json({
        success:false,
        message:"project not found"
    })
   }

    const workspace = await Workspace.findOne({
        _id:project.workspace,
        members:userId
    })

    if(!workspace){
        return res.status(404).json({
            success:false,
            message:"Workspace not found"
        })
    }

    const comments = await Comment.find({
        task:taskId
    }).populate("createdBy" , "name email role")

    return res.status(200).json({
        success:true,
        message:"Comments fetched successfully",
        comments
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

const updateComment = async (req,res) => {

  try{

   const taskId = req.params.taskId;
   const commentId= req.params.commentId;
   const userId = req.user.id;
   let content = req.body.content

   if(!content){
    return res.status(400).json({
       success:false,
       message:"Content is missing"
    })
   }

   content = content.trim()

   if(content === ""){
    return res.status(400).json({
        success:false,
        message:"Content is missing"
    })
   }

   const task = await Task.findById(taskId)

   if(!task){
    return res.status(404).json({
        success:false,
        message:"task not found"
    })
   }

   const project = await Project.findById(task.project)

   if(!project){
    return res.status(404).json({
        success:false,
        message:"project not found"
    })
   }

    const workspace = await Workspace.findOne({
        _id:project.workspace,
        members:userId
    })

    if(!workspace){
        return res.status(404).json({
            success:false,
            message:"Workspace not found"
        })
    }

    const comment = await Comment.findOne({
        _id:commentId,
        task:taskId
    })

    if(!comment){
        return res.status(404).json({
            success:false,
            message:"Comment not found"
        })
    }

    if(comment.createdBy.toString() !== userId.toString()){
        return res.status(403).json({
            success:false,
            message:"Not authorized to update comment"
        })
    }

    comment.content = content,

   await comment.save()

   return res.status(200).json({
    success:true,
    message:"Comment updated successfully",
    comment
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

const deleteComment = async (req,res) => {

    try{

  const commentId = req.params.commentId;
  const taskId = req.params.taskId;
  const userId = req.user.id

  const task = await Task.findById(taskId)
  
  if(!task){
    return res.status(404).json({
        success:false,
        message:"Task not found"
    }) 
  }

  const project = await Project.findById(task.project)

  if(!project){
    return res.status(404).json({
        success:false,
        message:"project not found"
    })
  }

  const workspace = await Workspace.findOne({
    _id:project.workspace,
    members:userId
  })

  if(!workspace){
    return res.status(404).json({
        success:false,
        message:"workspace not found"
    })
  }

  const comment = await Comment.findOne({
    _id:commentId,
    task:taskId
  })

  if(!comment){
    return res.status(404).json({
        success:false,
        message:"Comment not found"
    })
  }

  if(comment.createdBy.toString() !== userId.toString()){
    return res.status(403).json({
        success:false,
        message:"Not authorized to delete comment"
    })
  }

  await comment.deleteOne()

  return res.status(200).json({
    success:true,
    message:"Comment deleted successfully"
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
    createComment,
    getComments,
    updateComment,
    deleteComment
}