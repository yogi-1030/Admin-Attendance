import express from "express";
import cors from "cors";
import morgan from "morgan";
import members from "./routes/members.js";
import attendance from "./routes/attendance.js";
import reports from "./routes/reports.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/members", members);
app.use("/api/attendance", attendance);
app.use("/api/reports", reports);

app.listen(5000, () => console.log("Server running on http://localhost:5000"));