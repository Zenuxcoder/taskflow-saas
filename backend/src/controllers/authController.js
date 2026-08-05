const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Session = require("../models/Session");
const uploadOnCloudinary = require("../config/cloudinary");
const { v2: cloudinary } = require("cloudinary");

const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
             success: false,
             message: "Please provide all fields"
        })

    }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
    return res.status(400).json({
    success: false,
    message: "User already exists"
});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword
        });

    return res.status(201).json({
     success: true,
     message: "User registered successfully",
});

    } catch (error) {

        console.error(error);

    return res.status(500).json({
    success: false,
    message: "Internal Server Error"
});
    }
};

const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
         return res.status(401).json({
          success: false,
           message: "Invalid email or password"
    });
}
        const isPasswordCorrect = await bcrypt.compare(
           password,
           user.password
      );

       if (!isPasswordCorrect) {
    return res.status(401).json({
        success: false,
         message: "Invalid email or password"
    });
}
       const accessToken = jwt.sign(
    {
        id: user._id,
    },  
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });

    const refreshToken = jwt.sign(
        {
            id:user._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )

const hashedRefreshToken = await bcrypt.hash(refreshToken, 10)

const refreshExpiryDays = parseInt(
    process.env.REFRESH_TOKEN_EXPIRY
);
const expiresAt = new Date();

expiresAt.setDate(
    expiresAt.getDate() + refreshExpiryDays
);

await Session.create({
    userId: user._id,
    refreshTokenHash: hashedRefreshToken,
    device: req.get("user-Agent"),
    expiresAt: expiresAt
});

    res.cookie("accessToken",accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000
});

    res.cookie("refreshToken", refreshToken , {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7* 24 * 60 * 60 * 1000
});

    return res.status(200).json({
    success: true,
    message: "Login successful"
});
}

 catch (error) {

        console.error(error);

    return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }

};

const getProfile = async (req, res) => {

    try {

        const userId = req.user.id;

        const user = await User.findById(userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

const logoutUser = async (req, res) => {
     
   const incomingRefreshToken = req.cookies.refreshToken
    
    if(!incomingRefreshToken){
         res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    }

    try {   
        
        const decoded = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        
        const session = await Session.findOne({
             userId :decoded.id
        })
        
        if(!session){
         res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
        });

         res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
        });

          return res.status(200).json({
        success: true,
        message: "Logout successful"
    });

}
        
        await Session.deleteOne({
        _id: session._id
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });
        
         res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });

    } catch (error) {
            res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    }

};

const refreshAccessToken = async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken;

if (!incomingRefreshToken) {
    return res.status(401).json({
        message: "Unauthorized"
    });
}

try {

    const decoded = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    );

    const session = await Session.findOne({
        userId: decoded.id
    });

    if (!session) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    const isMatch = await bcrypt.compare(
        incomingRefreshToken,
        session.refreshTokenHash
    );

    if (!isMatch) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    const accessToken = jwt.sign(
        {
            id:decoded.id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        } 
    )

    const refreshToken = jwt.sign(
        {
            id:decoded.id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
    
    const hashedRefreshToken = await bcrypt.hash(
    refreshToken,10
    );

    const refreshExpiryDays = parseInt(
    process.env.REFRESH_TOKEN_EXPIRY
);

    const expiresAt = new Date();

    expiresAt.setDate(
      expiresAt.getDate() + refreshExpiryDays
    );

    session.refreshTokenHash = hashedRefreshToken;
    session.expiresAt = expiresAt;

    await session.save();

    res.cookie("accessToken",accessToken,
        {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000
        }
    )
    res.cookie("refreshToken",refreshToken,
        {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7* 24 * 60 * 60 * 1000  
        }
    )

    return res.status(200).json({
  message:"Authentication refreshed successfully"
    })


} catch (error) {
    return res.status(401).json({
        success: false,
        message: "Invalid or Expired Refresh Token"
    });
}
};
 
const updateAvatar = async (req, res) => {

try {

if (!req.file) {
    return res.status(400).json({
        success: false,
        message: "Avatar is required"
    });
}

const avatar = await uploadOnCloudinary(req.file.path)
if (!avatar) {
    return res.status(500).json({
        success:false,
        message:"Failed to upload avatar"
    })
}

const user = await User.findById(req.user.id);
if (!user) {
    return res.status(404).json({
        success:false,
        message:"User not found"
    })
}

    const oldPublicId = user.avatar?.public_id;

    user.avatar = {
    url: avatar.url,
    public_id: avatar.public_id
};

await user.save();

if (oldPublicId) {
    try{
    await cloudinary.uploader.destroy(oldPublicId)
    }
    catch(error){
        console.error("Failed to delete old avatar:", error);
    };
}
return res.status(200).json({
    success: true,
    message: "Avatar updated successfully",
    avatar: user.avatar.url
});
}

catch(error){
    return res.status(500).json({
        success:false,
        message:"Internal Server Error"
    })
}
}

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    logoutUser,
    refreshAccessToken,
    updateAvatar
};