const Project = require("../models/Project")
const Workspace = require("../models/Workspace")


const createProject = async (req , res) => {

  try{
  let name = req.body.name;
  const description= req.body.description;
  const workspaceId = req.params.workspaceId;
  const userId = req.user.id
  

  if(!name){
    return res.status(400).json({
        success:false,
        message:"Enter name for project"
    })
  }

  name =name.trim()

   if(name === ""){
    return res.status(400).json({
        success:false,
        message:"Enter name for project"
    })
  }

  const workspace = await Workspace.findById(
        workspaceId
  )

 if(!workspace){
    return res.status(404).json({
        success:false,
        message:"workspace doesn't exists"
    })
 }

   const isMember = workspace.members.some(
    id => id.toString() === userId.toString()
   )
 
    if(!isMember){
        return res.status(403).json({
        success:false,
        message:"User not part of workspace"
    })
    }

  const duplicteCheck = await Project.findOne({
    workspace:workspaceId,
    name:name
  })

  if(duplicateCheck){
    return res.status(409).json({
        success:false,
        message:"Project with this name already exists in this workspace."
    })
  }

  const project = await Project.create({
     name : name,
     description : description,
     workspace : workspaceId,
     owner : userId
  }
)

  return res.status(201).json({
    success:true,
    message:"Project created successfully",
    project
  })

}

  catch(error){

     console.error(error)

     return res.status(500).json({
        success:false,
        message:"internal server issue"
     })

  }

}

const getProjects = async( req,res) => {

    try{

    const workspaceId = req.params.workspaceId;
    const userId = req.user.id 

    const workspace = await Workspace.findOne({
        _id:workspaceId,
        members:userId
    })

        if(!workspace){
        return res.status(404).json({
            success:false,
            message:"Workspace doesn't exists"
        })
        }

        const projects = await Project.find({
            workspace:workspaceId
        }).populate("owner","name email role")

      return res.status(200).json({
        success:true,
        message:"Projects fetched successfully",
        projects
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

const getProject = async(req,res) => {
  
    try{
   
   const projectId = req.params.projectId
   const userId = req.user.id
   
   let project = await Project.findById(projectId)

   if(!project){
    return res.status(404).json({
        success:false,
        message:"Project doesn't exists"
    })
   }

   const workspace = await Workspace.findOne({
    _id:project.workspace,
    members:userId
   })

   if(!workspace){
    return res.status(404).json({
        success:false,
        message:"Workpace doesnt exists"
    })
   }

   project = await project.populate("owner" , "email name role").populate("workspace" , "name description")

   return res.status(200).json({
    success:true,
    message:"project fetched successfully",
    project
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

const updateProject = async(req,res) => {

    try{
    const projectId = req.params.projectId;
    const userId = req.user.id;
    let name = req.body.name;
    const description = req.body.description

    if(!name && !description){
        return res.status(400).json({
            success:false,
            message:"Nothing to update"
        })
    }

    const project = await Project.findById(projectId)

    if(!project){
        return res.status(404).json({
            success:false,
            message:"Project not found1"
        })
    }

    if(name){
    name = name.trim()

        if(name === ""){
        return res.status(400).json({
            success:false,
            message:"Enter project name"
        })
    }
  } 

    const workspace = await Workspace.findById(project.workspace)

    if(!workspace){
       return res.status(404).json({
        success:false,
        message:"workspace doens't exists"
       })
    }

    const verifyOwner = userId === project.owner.toString() || userId === workspace.owner.toString()

   if(!verifyOwner){
    return res.status(403).json({
        success:false,
        message:"Not authorize to make any updates"
    })
   }

   if(name){
    const duplicateCheck = await Project.findOne({
    workspace:project.workspace,
    name:name,
    _id: { $ne: projectId }
    })

    if(duplicateCheck){
        return res.status(409).json({
            success:false,
            message:"Project name alredy exists"
        })
    }
    project.name=name
   }

   if(description){
    project.description=description
   }

   await project.save()

    return res.status(200).json({
      success:true,
      message:"Project Updated successfully",
      project
    })

    }

   catch(error){

     console.error(error)

     return res.status(500).json({
        success:false,
        message:"Internl server issue"
     })

   }

}


const deleteProject = async(req,res) => {
 
    try{

    const projectId = req.params.projectId;
    const userId = req.user.id;
    
   const project = await Project.findById(projectId)

    if(!project){
        return res.status(404).json({
            success:false,
            message:"Project doesn't exists"
        })
    }

    const workspace = await Workspace.findById(project.workspace)

    if(!workspace){
        return res.status(404).json({
            success:false,
            message:"Workspace doesn't exists"
        })
    }

     const verifyOwner = userId === project.owner.toString() || userId === workspace.owner.toString()
    
    if(!verifyOwner){
        return res.status(403).json({
            success:false,
            message:"Not authorized to delete project"
        })
    }

    await project.deleteOne()
    
    return res.status(200).json({
        success:true,
        message:"Project deleted successfully"
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
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject
}
