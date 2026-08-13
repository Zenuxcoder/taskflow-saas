const Project = require("../models/Project");
const Task = require("../models/Tasks");
const Workspace = require("../models/Workspace")
const User = require("../models/User")


const createTask = async(req,res) => {

 try{
    const projectId =  req.params.projectId;
    const userId = req.user.id;
    let title = req.body.title;
    const description = req.body.description;
    let assignedTo = req.body.assignedTo;
    const priority = req.body.priority;
    const dueDate = req.body.dueDate;

    if(!title){
        return res.status(400).json({
            success:false,
            message:"Enter a valid title"
        })
    }

    title= title.trim()

    if(title === ""){
        return res.status(400).json({
            success:false,
            message:"Enter a valid title"
        })
    }

    const project = await Project.findById(projectId)

    if(!project){
        return res.status(404).json({
            success:false,
            message:"Project not found"
        })
    }

    const workspace = await Workspace.findOne({
       _id: project.workspace,
        members:userId
})

    if(!workspace){
        return res.status(404).json({
            success:false,
            message:"workspace not found"
        })
    }
     
    if(assignedTo){
        const assignedUser = await User.findById(assignedTo)
    if (!assignedUser){
        return res.status(404).json({
            success:false,
            message:"Asign user not found"
        })
    }
    const isMember = await Workspace.findOne({
        _id:project.workspace,
        members:assignedTo
    })

    
    if(!isMember){
        return res.status(404).json({
            success:false,
            message:"Assigned user not a part of workspace"
        })
    }
}

    const task = await Task.create({
        title:title,
        description:description,
        assignedTo:assignedTo,
        priority:priority,
        dueDate:dueDate,
        createdBy:userId,
        project:projectId
    })

    return res.status(201).json({
        success:true,
        message:"Task created successfully",
        task
    })

}   
 
  catch(error)  {
    
    console.error(error)

    return res.status(500).json({
        success:false,
        message:"Internal server issue"
    })
  }
}

const getAllTasks = async (req,res) => {
  
    try{

        const projectId = req.params.projectId;
        const userId = req.user.id

        const project = await Project.findById(projectId)

        if(!project){
            return res.status(404).json({
                success:false,
                message:"Project not found"
            })
        }

        const workspace = await Workspace.findOne({
            _id: project.workspace,
            members: userId
        })

        if(!workspace){
            return res.status(404).json({
            success:false,
            message:"Workspace not found"
            })
        }

        const tasks = await Task.find({
            project:projectId
        }).populate("createdBy", "name email role")
        .populate("assignedTo", "name email role")
 

        return res.status(200).json({
            success:true,
            message:"Tasks fetched successfully",
            tasks
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

const getTask = async (req, res) => {

    try{

     const projectId = req.params.projectId;
     const taskId = req.params.taskId;
     const userId = req.user.id

    const project = await Project.findById(projectId)

    if(!project){
        return res.status(404).json({
            success:false,
            message:"project doesn't exists"
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

     const task  = await Task.findOne({
        _id:taskId,
        project:projectId
     }).populate("createdBy", "name email role")
       .populate("assignedTo", "name email role");

     if(!task){
        return res.status(404).json({
            success:false,
            message:"Task not found" 
        })
     }

     return res.status(200).json({
        success:true,
        message:"Task fetched successfully",
        task
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

const updateTask = async (req,res) => {

    try{
      const projectId = req.params.projectId;
      const taskId = req.params.taskId;
      const userId = req.user.id;
      let {title,description,assignedTo,status,priority,dueDate,} = req.body

        const project = await Project.findById(projectId)

        if(!project){
            return res.status(404).json({
                success:false,
                message:"Project not found"
            })
        }

        const workspace =  await Workspace.findOne({
            _id:project.workspace,
            members:userId,
        })

        if(!workspace){
            return res.status(404).json({
                success:false,
                message:"workspace not found"
            })
        }

        const task = await Task.findOne({
            _id:taskId,
            project:projectId
            })

        if(!task){
            return res.status(404).json({
                success:false,
                message:"Task not found"
            })
        }

        if(title){
            title = title.trim() 
            if(title === ""){
              return res.status(403).json({
                success:false,
                message:"Enter valid title"
              })
            }        
        }

        if("assignedTo" in req.body){
          if (assignedTo === null) {
           task.assignedTo = null;
         } else {
        const assignedTOworkspace =  await Workspace.findOne({
            _id:project.workspace,
            members:assignedTo,
        })

        if(!assignedTOworkspace){
            return res.status(404).json({
                success:false,
                message:"workspace not found"
            })
        }
        }
    }

        
       if (title) {
         task.title = title
           }

        if (assignedTo) {
          task.assignedTo = assignedTo
           }

       if ("description" in req.body) {
           task.description = description
          }

        if ("dueDate" in req.body) {
          task.dueDate = dueDate
          }

       if (priority) {
          task.priority = priority
            }

       if (status) {
            task.status = status
            }

        await task.save()

        return res.status(200).json({
            success:true,
            message:"Task updatedd successfully",
            task
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

const deleteTask = async(req,res) => {
    
    try{

    const projectId = req.params.projectId;
    const taskId = req.params.taskId;
    const userId = req.user.id;

    const project = await Project.findById(projectId)

    if(!project){
        return res.status(404).json({
            success:false,
            message:"Project not found"
        })
    }

    const workspace =  await Workspace.findOne({
            _id:project.workspace,
            members:userId,
        })

        if(!workspace){
            return res.status(404).json({
                success:false,
                message:"workspace not found"
            })
        }

        const task = await Task.findOne({
            _id:taskId,
            project:projectId
        })

        if(!task){
            return res.status(404).json({
                success:false,
                message:"task not found"
            })
        }

        const isOwner = 
             userId.toString() === workspace.owner.toString() 
             ||
             userId.toString() === task.createdBy.toString()

        if(!isOwner){
            return res.status(403).json({
                success:false,
                message:"You are not authorized to delete this task"
            })
        }

        await task.deleteOne()

        return res.status(200).json({
            success:true,
            message:"Task deleted successfully"
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
    createTask,
    getAllTasks,
    getTask,
    updateTask,
    deleteTask
}