#### In achieving this api, this steps were taken
- Create a folder for controllers ( Are functions that handles request and response call for the user)
- create a folder that handles the Middlewares
- Create a folder for different data we are to feed to the database
- Create models for the api( Such as user model, Reservation model, Listing model and many more)
- Craete the folder for the different routers using 
- Create the root file which will handle the routing 



#### Nodemon and Basic Express Server

In order to achieve the server, we have to craete one. This can be done by:

```js
import express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.send('Welcome!');
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is listening on port ${port}...`));
```

#### Not Found Middleware
- Idea is to detect for any error when a route which is not specified was being reached out to
- The code can be seen below
```js

const NotFound = (req, res, next)=> {
    const error = new Error(`Not found - ${req.originalUrl}`)
    res.status(404)
    next(error)
    
}
```


#### Error Middleware

- The basic Idea about this function is to detect for any error that take place during the request and response cycle

```js
const errorHandler =(err, req, res, next)=> {
    const statuscode = res.statusCode === 200? 500:res.statusCode
    const errMessage = err.message
    res.status(statuscode)
    res.json({
        message:errMessage,

    })
}

```

#### INSTALLING PACKAGES
- Packages or dependencies that needed to be available in application includes


```js
   "dependencies": {
    "bcryptjs": "^2.4.3",
    "cloudinary": "^1.37.3",
    "concurrently": "^7.6.0",
    "config": "^3.3.8",
    "cookie-session": "^2.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "express-async-handler": "^1.2.0",
    "express-session": "^1.17.3",
    "googleapis": "^120.0.0",
    "jsonwebtoken": "^9.0.0",
    "moment": "^2.29.4",
    "mongoose": "^6.8.1",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.3",
    "passport": "^0.6.0",
    "passport-google-oauth20": "^2.0.0",
    "stripe": "^11.18.0",
    "uuid": "^9.0.0"
  },
```

#### CREATING models

- USER MODELS
``` JS
import mongoose from "mongoose";

// a structure of the user
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    username: {
      type: String,
    },
    googleId: {
      type: String,
    },
    image: {
      type: String,
    },
    phone: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: [true, "PLease add an emailvalue"],
    },
    password: {
      type: String,
      required: [true, "PLease add a password value"],
    },
    verified: {
      type: Boolean,
      default: false,
    },

    about: {
      from: { type: String },
      language: { type: Array, default: [] },
      description: { type: String },
      skills: { type: Array, default: [] },
      information: { type: String },
    },
    country: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "seller", "admin"],
      default: "user",
    },
    level: {
      type: String,
      default: "level 1 seller",
      enum: ["level 1 seller", "level 2 seller", "level 3 seller"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);

```

## Listing models
- The basic idea about this structure is that it is responsible for defining the schema of our lisitng or rentals that various users interested in buying and selling will have to conform to

```js

import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema(
  {
    listing_host_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    listing_image: {
      type: Array,
      // required: [true, 'PLease add the image value for the Listing']
    },
    listing_title: {
      type: String,
      required: true,
    },
    listing_country: {
      type: String,
    },
    listing_city: {
      type: String,
    },
    listing_location: {
      type: String,
    },
    listing_region: {
      type: String,
    },
    listing_distance: {
      type: Number,
    },
    listing_description: {
      type: String,
      required: true,
    },
    listing_type: {
      type: String,
    },
    listing_price: {
      type: Number,
      required: true,
    },
    listing_bedrooms: {
      type: Number,
    },
    listing_guests: {
      type: Number,
    },
    listing_bathrooms: {
      type: Number,
    },
    listing_beds: {
      type: Number,
    },
    listing_startDate: {
      type: String,
    },
    listing_endDate: {
      type: String,
    },
    listing_duration: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Listings", ListingSchema);


```
## Reservation model
- Basically responsible for the structure of the various reservations the user who is interested in.
- The schema can be seen below
```js

  import mongoose from "mongoose";

// resrevations schema of the buyer the gig created by the author
const ReservationSchema = new mongoose.Schema(
    // this is the id of the seller or creator 
  {
    listing_host_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // the listing id the user is reserving
    listing_Id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Listings",
    },
    gigQuantity: {
      type: Number,
    },
    subtotal: {
      type: Number,
    },
    tax: {
      type: Number,
    },
    adults: {
      type: Number,
    },
    children: {
      type: Number,
    },
    infants: {
      type: Number,
    },
    startDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Reservation", ReservationSchema);

```
### Order model
- The order structure has to be defined since it defines the basis of the transaction that will take place
```js
 import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    reservation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservations",
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    image: {
      type: Array,
    },
    title: {
      type: String,
    },
    price: {
      type: Number,
    },
    paidAt: {
      type: Date,
    },
    startDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Delivered", "Not Delivered"],
      default: "Pending",
    },
    adults: {
      type: Number,
    },
    children: {
      type: Number,
    },
    infants: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);

```

## Creating our various routes

### These are the various routes
* User route
* Listing route
* Reservations route
* Order route

## User route
```js
 import express from "express";
//  steps taken to create the router
const router = express.Router();
<!--  important middlewares -->
import {
  adminMiddleware,
  authMiddleware,
} from "../middleware/authentication.js";
<!-- controllers or functions needed -->
import {
  GetUserById,
  GetAllUser,
  UpdateUser,
  DeleteUser,
  AdminUpdateUser,
  GetUsersProfile,
} from "../controllers/userControllers.js";

<!-- route to get all users -->
router.get("/", authMiddleware, adminMiddleware, GetAllUser);
<!-- route to delete, update and get a single user  -->
<!--  it is reserved for the admin only -->
router
  .route("/admin/profile/:id")
  .delete(authMiddleware, adminMiddleware, DeleteUser)
  .get(authMiddleware, GetUserById)
  .put(authMiddleware, adminMiddleware, AdminUpdateUser);

<!-- route to update and get user profile: id of the user is needed -->
router
  .route("/profile/:id")
  .put(authMiddleware, UpdateUser)
  .get(authMiddleware, GetUsersProfile);
export default router;

```



## Listing route
```js
 import express from "express";
const router = express.Router();
import {
  adminMiddleware,
  authMiddleware,
  sellerAdminMiddleware,
} from "../middleware/authentication.js";

import {
  GetSingleListing,
  GetAllListing,
  UpdateListing,
  DeleteListing,
  CreateSingleListing,
  GetHostListing,
} from "../controllers/listingControllers.js";

<!-- route for creating listing and getting all the listing -->
router
  .route("/")
  .get(GetAllListing)
  .post(authMiddleware, sellerAdminMiddleware, CreateSingleListing);

<!-- get all of the host listing -->
router.route("/host/:id").get(GetHostListing);

<!-- route for getting a single lisitng, updating the lisitng and deleting -->
router
  .route("/:id")
  .get(GetSingleListing)
  .put(authMiddleware, sellerAdminMiddleware, UpdateListing)
  .delete(authMiddleware, DeleteListing);

export default router;

```


