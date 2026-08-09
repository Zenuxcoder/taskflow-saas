const User = require("../models/User");
const Workspace = require("../models/Workspace");

const createWorkspace = async (req, res) => {
   
   try{
    const {name,description} =  req.body
    if(!name){
        return res.status(400).json({
            success: false,
            message: "Workspace name is required."
            });
    }
    if(name.trim() === ("")){
         return res.status(400).json({
            success: false,
            message: "Enter a valid name"
            });
    }

    const userId = req.user.id;

    const user = await User.findById(userId)

    if(!user){
        return res.status(404).json({
            success: false,
            message: "User doesn't exists"
            });
    }

   const workspace =  await Workspace.create(

        {

            name:name,
            description:description,
            owner:user.id,
            members:[user.id]
        }
    )

        
    return res.status(201).json({
        success:true,
        message:"Workspace created successfully",
        workspace
    })
   }
     catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
   }

}


const getWorkspaces = async (req, res) => {

    try{
     
        const userId = req.user.id

        const user = await User.findById(userId)

        if(!user){
            return res.status(404).json({
            success: false,
            message: "User not found"
            });
        }
        const workspaces = await Workspace.find({
        members: userId
        }).populate("owner", "name email role").populate("members", "name email role")

        return res.status(200).json({
            success:true,
            message:"Workspaces fetched successfully.",
            workspaces:workspaces
        })
   }

    catch(error){
       
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
   }

}

const getWorkspaceById =  async (req,res) => {

      const workspaceId = req.params.workspaceId;
      const userId = req.user.id

      try{
       const workspace = await  Workspace.findOne({
            _id : workspaceId,
            members : userId
      }).populate("owner", "name email role").populate("members", "name email role")

        if(!workspace){
           return res.status(404).json({
                success:false,
                message:"Workspace not found"
            })
        }
         
        return res.status(200).json({
            success:true,
            message:"Workspace found successfully",
            workspace:workspace
        })
      }
      
      catch(error){
          
         console.error(error)

         return res.status(500).json({
            success:false,
            message:" Internal Server error"
         })
      }

}

 const updateWorkspace = async (req,res) => {

  try{
    const workspaceId = req.params.workspaceId;
    const userId = req.user.id;
    let name = req.body.name;
    const description = req.body.description;

    if(!name && !description){
        return res.status(400).json({
            success:false,
            message:"Nothing to update"
        })
    } 
     if (name ){
    if(name.trim() === ("") ) {
        return res.status(400).json({
            success:false,
            message:"be a valid user"
        })
    }}
    
    const workspace = await Workspace.findOne({
        _id:workspaceId
    })

    if(!workspace){
        return res.status(404).json({
            success:false,
            message:"Workspace doesn't exist"
        })
    }

    const ownerId = workspace.owner.toString()
    if( !(ownerId === userId)){
        return res.status(403).json({
            success : false,
            message:"You are not authorized to make changes"
        })
    }

        if(name){
        workspace.name = name
        }

        if(description){
        workspace.description = description
        }
        
        await workspace.save()

        return res.status(200).json({
        success:true,
        message:"Update Successful",
        workspace
         })
   }

  catch(error){
     
     console.error(error)

     return res.status(500).json({
        success:false,
        message:"Internal server error"
     })
  }

}

 const deleteWorkspace = async (req,res) => {

    try{
     
     const workspaceId = req.params.workspaceId
     const userId = req.user.id

     const workspace = await Workspace.findOne({
        _id : workspaceId,
        owner : userId
    })

    if(!workspace){
        return res.status(404).json({
            success:false,
            message:"Workspace not found"
        })
    }

     await workspace.deleteOne()

      return res.status(200).json({
        success:true,
        message:"Workspace deleted succesfully"
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

 const inviteMember = async (req,res) => {

   try{

     const workspaceId = req.params.workspaceId
     const userId = req.user.id
     let email = req.body.email

      if(!email){
        return res.status(404).json({
            success:false,
            message:"Enter member to add"
        })
    } 

     email = email.trim()

     if(email === ""){
        return res.status(400).json({
            success:false,
            message:"Enter a member to invite"
        })
    }
      
     const member = await User.findOne({
         email:email
     })

     if(!member){
        return res.status(404).json({
            success:false,
            message:"user not found"
        })
     }

     const workspace = await Workspace.findOne({
        _id : workspaceId,
        owner : userId
     }) 

     if(!workspace){
        return res.status(404).json({
            success:false,
            message:"workspace not found"
        })
     }
    
     const alreadyMember = workspace.members.some(
    id => id.toString() === member._id.toString()
    );

     if(alreadyMember){
        return res.status(409).json({
            success:false,
            message:"User already in workspace"
        })
     }

     workspace.members.push(member._id)

     await workspace.save()
      
    return res.status(200).json({
        success:true,
        message:"Member added successfully"
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

 const removeMember = async (req,res) => {

   try{ 
    const workspaceId = req.params.workspaceId
    const userId = req.user.id
    let email = req.body.email

    if(!email){
        return res.status(404).json({
            success:false,
            message:"Enter a member to remove"
        })
    }

    email = email.trim()

    if(email === ""){
        return res.status(400).json({
            success:false,
            message:"Enter a member to remove"
        })
    }

    const workspace = await Workspace.findOne({
        _id:workspaceId,
        owner:userId
    })

    if(!workspace){
        return res.status(404).json({
            success:false,
            message:"workspace doesnt exists"
        })
    }

    const member = await User.findOne({
        email:email
    })

    if(!member){
        return res.status(404).json({
            success:false,
            message:"user doesnt exist"
        })
    }

    if(workspace.owner.toString() === member._id.toString()){
        return res.status(403).json({
            success:false,
            message:"can not remove owner"
        })
    }

    const alreadyMember = workspace.members.some(
         id => id.toString() === member._id.toString()
 )

    if(!alreadyMember){
        return res.status(404).json({
            success:false,
            message:"User isnt member of workspce"
        })
    }

    workspace.members.pull(member._id)

   await workspace.save()    
 
    return res.status(200).json({
        success:true,
        message:"User removed succesfully"
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
       createWorkspace,
       getWorkspaces,
       getWorkspaceById,
       updateWorkspace,
       deleteWorkspace,
       inviteMember,
       removeMember
 }