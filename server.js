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
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./swagger.js";
import swaggerJsdoc from "swagger-jsdoc";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/login", loginRouter);
app.use("/register", registerRouter);

app.use("/api", (req, res, next) => {
    if (req.path.startsWith("/swagger")) return next();
    validateSession(req, res, next);
})

app.use("/api/users", usersRouter);
app.use("/api/apartments", apartmentsRouter);
app.use("/api/announcements", announcementsRouter);
app.use("/api/requests", requestsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT);

export default app;