import express from "express";
import path from "path";
import dotenv from "dotenv";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express'

dotenv.config();

const app = express();
import { errorHandler, NotFound } from "./middleware/error-handler.js";

import mongoose from "mongoose";

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const options = {
  definition: {
    openapi: '3.0.0',
    info:{
      title:"Airbnb api",
      version:"0.1.0",
      description:"This api is a product of my clone of the airbnb rental platform full-stack project"
    },
    servers:[
      {
        url:'http://localhost:3000/'
      }
    ],
    info: {
      title: 'Hello World',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes*.js'], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))
// routes

import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import reviewRoute from "./routes/reviewRoutes.js";
import listingRoute from "./routes/listingRoutes.js";
import uploadRoute from "./routes/uploadRoute.js";
import reservationRoute from "./routes/reservations.js";
import orderRoute from "./routes/orderRoutes.js";
import chatRoute from "./routes/chatRoutes.js";

// end points

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/listing", listingRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/upload", uploadRoute);
app.use("/api/v1/reservations", reservationRoute);
app.use("/api/v1/chat", chatRoute);
// app.get('/payment_intents', getAllStripePaymentIntent)
const __dirname = path.resolve();

// console.log((path.join(__dirname, '/public/uploads')))

mongoose.connect(
  process.env.MONGO_URl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("mongo has been connected");
  }
);

// production mode process

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   app.get("*", (req, res) =>
//     res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
//   );
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running....");
//   });
// }

// Middlewares
app.use(NotFound);
app.use(errorHandler);

app.listen(5000, () => {
  console.log("server is listening on port 4000");
});
