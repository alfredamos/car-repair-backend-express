import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route";
import tokenRoute from "./routes/token.route";
import customerRoute from "./routes/customer.route";
import notFoundRouteMiddleware from "./middlewares/notFoundRouteMiddleware.middleware";
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware.middleware";
import { authenticationMiddleware } from "./middlewares/authenticationMiddleware.middleware";

dotenv.config();

//----> Initialize express app.
const app = express();

//----> Get the port number from the environment from a file.
const Port = process.env.PORT || 5000;

//----> Parse cookie.
app.use(cookieParser());

//----> Activate cors.
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200", "http://localhost:5173"],
  })
);

//----> Not url encoded
app.use(express.urlencoded({ extended: false }));

//----> Allow json
app.use(express.json());

//----> Authenticate user.
app.use(authenticationMiddleware);

//----> Auth routes.
app.use("/api/auth", authRoute);

//----> Customer routes.
app.use("/api/customers", customerRoute);

//----> Ticket routes.

//----> Token routes.
app.use("/api/tokens", tokenRoute);

//----> User routes.

//----> Not found routes and error middleware.
app.use(notFoundRouteMiddleware);
app.use(errorHandlerMiddleware);

//----> Listening port.
app.listen(Port, () => console.log(`App is listening on ${Port}...`));
