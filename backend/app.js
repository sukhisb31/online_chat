import express from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";

const app = express();

config({path: './config/config.env'});

app.use(
    cors({
         origin : [ process.env.FRONTEND_URL ],
        credentials: true,
        methods: ["POST", "GET", "PUT", "DELETE"] 
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "./temp/",
    })
)

export default app;