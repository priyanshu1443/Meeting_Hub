
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Connection } from "./db/connection.js";
import UserRoutes from "./routers/authentication.js";
import MeetingRouters from "./routers/meetingroutes.js";

import { Server } from "socket.io";

dotenv.config();
Connection();

const port = process.env.PORT || 8000;
// const ip = process.env.IP_ADDRESS;


const app = express();
app.use(express.json());



app.use(cors(
    {
        origin: process.env.CLINT_PORT,
        credentials: true
    }

))
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", process.env.CLINT_PORT);
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    next();
});

app.use(cookieParser())

app.use("/api", UserRoutes);
app.use("/api", MeetingRouters);

app.get("/", (req, res) => {
    res.send("welcome to backend of the meeting hub")
})

var server = app.listen(port, () => {
    console.log(`Server is running on port number : ${port}`);
});

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

var userConnection = [];

io.on("connection", (socket) => {

    socket.on("user_connect", (data) => {
        var other_users = userConnection.filter(
            (p) => p.meeting_id === data.meetingid
        );
        userConnection.push({
            connectionId: socket.id,
            user_id: data.display_name,
            meeting_id: data.meetingid,
            mainuser_Id: data.mainuser_Id,
        });
        var userCount = userConnection.length;
        other_users.forEach((v) => {
            socket.to(v.connectionId).emit("inform_others_about_me", {
                other_user_id: data.display_name,
                connId: socket.id,
                userNumber: userCount,
                mainuser_Id: data.mainuser_Id
            });
        });

        socket.emit("inform_me_about_other_user", other_users);
    });

    socket.on("SDPProcess", (data) => {
        socket.to(data.to_connid).emit("SDPProcess", {
            message: data.message,
            from_connid: socket.id,
        });
    });

    socket.on("sendMessage", (msg) => {
        var mUser = userConnection.find((p) => p.connectionId == socket.id);
        if (mUser) {
            var meetingid = mUser.meeting_id;
            var from = mUser.user_id;
            var list = userConnection.filter((p) => p.meeting_id == meetingid);
            list.forEach((v) => {
                socket.to(v.connectionId).emit("showChatMessage", {
                    from: from,
                    message: msg,
                });
            });
        }
    });
    socket.on("streaming_is_stopped", () => {
        for (const users of userConnection) {
            if (users.connectionId != socket.id) {
                var to = users.connectionId;
                socket.to(to).emit("streamIsStopped", {
                    by: socket.id,
                });
            }
        }
    });

    socket.on("raise_hand", () => {
        var raisHandUser = userConnection.find((p) => p.connectionId == socket.id);
        for (const users of userConnection) {

            if (users.connectionId != socket.id) {
                var to = users.connectionId;

                socket.to(to).emit("hand_raise", {
                    by: socket.id,
                    name: raisHandUser.user_id,

                });
            }
        }
    });

    socket.on("videoAndScreenShare", (data) => {
        for (const users of userConnection) {
            if (users.connectionId != socket.id) {
                var to = users.connectionId
                socket.to(to).emit("videoAndScreenShare", {
                    by: socket.id,
                    video: data,
                })
            }
        }
    })

    socket.on("disconnect", () => {
        var disUser = userConnection.find((p) => p.connectionId == socket.id);
        if (disUser) {
            var meetingid = disUser.meeting_id;
            userConnection = userConnection.filter(
                (p) => p.connectionId != socket.id
            );
            var list = userConnection.filter((p) => p.meeting_id == meetingid);
            list.forEach((v) => {
                var userNumberAfterLeave = userConnection.length;
                socket
                    .to(v.connectionId)
                    .emit("inform_another_about_disconnected_user", {
                        connId: socket.id,
                        uNumber: userNumberAfterLeave,
                    });
            });
        }
    });
});

io.on("error", (err) => {
    console.error("Socket.IO Error:", err);
});

