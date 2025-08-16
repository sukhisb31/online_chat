import mongoose from "mongoose";

export const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "MERN_STACK_CHAT_APP",
    }).then(() => {
        console.log("connected to DataBase.");

    }).catch((err) => {
        console.log(`Error connection to DB: ${err.message || err}`);

    })
};