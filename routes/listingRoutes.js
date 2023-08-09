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

router
  .route("/")
  .get(GetAllListing)
  .post(authMiddleware, sellerAdminMiddleware, CreateSingleListing);

router.route("/host/:id").get(GetHostListing);
router
  .route("/:id")
  .get(GetSingleListing)
  .put(authMiddleware, sellerAdminMiddleware, UpdateListing)
  .delete(authMiddleware, DeleteListing);

export default router;
