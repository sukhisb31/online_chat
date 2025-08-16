import { catchAsyncError } from "../middlewares/catchAsyncError.middleware.js"
import { User } from "../models/user.model.js";
import  bcrypt  from "bcryptjs"
import { generateJWTToken } from "../utils/jwtToken.js";

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
    const hashedPassword = await bcrypt.hash( password, 10 );

    const user = await User.create({
        fullName,
        email,
        password,
        avtar: {
            public_id : "",
            url: ""
        }
    });

    generateJWTToken(user, "User registered successfully", 201, res);
}); 
// ========= signin============
export const signin = catchAsyncError(async(req, res, next) => {});
export const signout = catchAsyncError(async(req, res, next) => {});
export const getUser = catchAsyncError(async(req, res, next) => {});
export const updateProfile = catchAsyncError(async(req, res, next) => {});