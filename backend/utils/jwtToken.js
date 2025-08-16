import jwt from "jsonwebtoken";

export const generateJWTToken = async (user, message, statusCode, res) => {
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, {
        expiresIn : process.env.JWT_EXPIRE,
    });

    return res.status(statusCode).cookie("token", token,{
        httpOnly: true,
        maxAge: process.env.COOKIE_EXPIRE,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development" ? true : false
    }).json({
        success: true,
        message,
        token
    });
};

