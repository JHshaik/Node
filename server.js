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
app.use(["/swagger", "/api/swagger"], swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.redirect("/api/swagger");
});

app.use(["/login", "/api/login"], loginRouter);
app.use(["/register", "/api/register"], registerRouter);

app.use((req, res, next) => {
  if (req.path.startsWith("/swagger") || req.path.startsWith("/api/swagger") || req.path.startsWith("/login") || req.path.startsWith("/api/login") || req.path.startsWith("/register") || req.path.startsWith("/api/register") || req.path === "/favicon.ico") {
    return next();
  }
  validateSession(req, res, next);
});

app.use(["/users", "/api/users"], usersRouter);
app.use(["/apartments", "/api/apartments"], apartmentsRouter);
app.use(["/announcements", "/api/announcements"], announcementsRouter);
app.use(["/requests", "/api/requests"], requestsRouter);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT);

export default app;