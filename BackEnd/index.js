import express, { urlencoded } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './Utils/db.js';
import userRoute from './Routes/user.route.js';
import postRoute from './Routes/post.route.js';
import messageRoute from './Routes/message.route.js';
import cookieParser from 'cookie-parser';
import { app ,server } from './socket/socket.js';
import path from 'path'

dotenv.config();


const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
    origin: process.env.URL,
    credentials: true
}
app.use(cors(corsOptions));

// yha pr apni api ayengi
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);


app.use(express.static(path.join(__dirname, "/FrontEnd/dist")));
app.get("*", (req,res)=>{
    res.sendFile(path.resolve(__dirname, "FrontEnd", "dist", "index.html"));
})


server.listen(PORT, () => {
    connectDB();
    console.log(`Server listen at port ${PORT}`);
});