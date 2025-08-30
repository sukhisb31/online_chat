import { Server } from "socket.io";

let io;

const userSocketMap = {};

export function initSocket (server){
    io = new Server(server, {
        cors: {
            origin: [process.env.FRONTEND_URL],
        }
    });


    io.on("connection", (socket)=>{
        console.log("A User connected to the io server", socket.id);

        const userId = socket.handShake.query.userId;
        if(userId) userSocketMap[userId] = socket.id;

        io.emit("getOnlineUser", Object.keys(userSocketMap));
        socket.on("disconnect", () => {
            console.log("A User disconnect", socket.id);
            delete userSocketMap[userId];
            io.emit("getOnlineUser", Object.keys(userSocketMap));
        });
    });

}
export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}
export { io }; 