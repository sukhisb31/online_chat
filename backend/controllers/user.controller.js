import { catchAsyncError } from "../middlewares/catchAsyncError.middleware.js"
import { User } from "../models/user.model.js";
import  bcrypt  from "bcryptjs"
import { generateJWTToken } from "../utils/jwtToken.js";
import { v2 as cloudinary } from "cloudinary";

export const signup = catchAsyncError(async(req, res, next) => {
    const {fullName, email, password} = req.body;

    if(!fullName || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "reuired all fields compulsory",
        });
    };

    const emailRegex = /^\S+@\S+\.\S+$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({
            success: false,
            message: "Invalid email format"
        });
    };
    if(password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "password must be atleast 8 character or more. "
        })
    };

    const isEmailAlreadyUsed = await User.findOne({email});
    if(isEmailAlreadyUsed){
        return res.status(400).json({
            success: false,
            message: "Email is already in used",
        });
    };

    // password hashed
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        fullName,
        email,
        password:hashedPassword,
        avtar: {
            public_id : "",
            url: ""
        }
    });

    generateJWTToken(user, "User registered successfully", 201, res);
}); 
// ========= signin============
export const signin = catchAsyncError(async(req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({
            success:  false,
            message: "please provide email and password"
        });
    };

   const emailRegex = /^\S+@\S+\.\S+$/;
    if(!emailRegex.test(email)  ){
        return res.status(400).json({
            success: false,
            message: "Invalid email format"
        });
    };

const user = await User.findOne({ email });
if(!user){
    return res.status(400).json({
        success: false,
        message: " Invalid Credentials."
    });
};
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if(!isPasswordMatched){
        return res.status(400).json({
            success: false,
            message: " password do not matched. check password"
        });
    };
    generateJWTToken (user, "User Logedin successfully", 200, res)
     
});


//================== signout =================
export const signout = catchAsyncError(async(req, res, next) => {
    res.status(200).cookie("token", "", {
        maxAge : '',
        httpOnly: true,
        sameSite: "strict",
        secure:  process.env.NODE_ENV !== "development" ? true : false,
    }).json({
        success: true,
        message: "User logout successfully"
    });

});

export const getUser = catchAsyncError(async(req, res, next) => {
    //choose anyone because allready get user info stored in user at auth.middleware.js
    // const user = await User.findById(req.user._id);
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    })
});

export const updateProfile = catchAsyncError(async(req, res, next) => {
    const {fullName, email} = req.body;
    if(fullName.trim().length === 0 || email.trim().length === 0 ){
        return res.status(400).json({
            success: false,
            messsage: "Full name and email can't be empty."
        });
    }

    const avtar = req?.files?.avtar;
    let cloudinaryResponse = {};
    if(avtar){
        try {
            const oldAvtarPublicId = req.user?.avtar?.public_id;
            if(oldAvtarPublicId && oldAvtarPublicId.length > 0){
               await cloudinary.uploader.destroy(oldAvtarPublicId);
            };

            cloudinaryResponse = await cloudinary.uploader.upload(
                avtar.tempFilePath, {
                     folder: "CHAT_APP_USER_AVTAR",
                     transformation: [
                        {width:300, height: 300, crop: "limit"},
                        {quality: "auto"},
                        {fetch_format: "auto"},
                     ],
                }
            );
        } catch (error) {
            console.error("cloudinary upload failed", error);
            return res.status(400).json({
                success: false,
                message: "profile updated failed. try again later.",
                  error: error.message,
            })
        }
    }

    let data = { fullName, email};

    if( avtar && cloudinaryResponse?.public_id && cloudinaryResponse?.secure_url){
        data.avtar = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        }
    }

    let user = await User.findByIdAndUpdate(req.user._id, data, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user
    });
  
});