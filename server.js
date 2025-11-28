import exprees from "express";
import "dotenv/config";
import cors from "cors";
import http from 'http';
import { connectDB } from "./lib/db.js";


const app = exprees();

const server = http.createServer(app);


app.use(exprees.json({limit: "4mb"}));
app.use(cors());

app.use("/ap/status",(req,res)=>res.send("OK"));

await connectDB();

const PORT = process.env.PORT || 5001;


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

});