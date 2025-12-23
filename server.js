import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.js";
import apartmentsRouter from "./routes/apartments.js";
import announcementsRouter from "./routes/announcements.js";
import requestsRouter from "./routes/requests.js";
import loginRouter from "./routes/login.js";
import validateSession from "./middleware/validateSession.js";
import registerRouter from "./routes/register.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use(validateSession);
app.use("/users", usersRouter);
app.use("/apartments", apartmentsRouter);
app.use("/announcements", announcementsRouter);
app.use("/requests", requestsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT);