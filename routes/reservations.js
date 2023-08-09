import express from "express";
const router = express.Router();
import {
  adminMiddleware,
  authMiddleware,
  sellerAdminMiddleware,
} from "../middleware/authentication.js";

import {
  CreateBuyerReservations,
  DeleteBuyerReservations,
  UpdateBuyerReservations,
  GetAllBuyerReservations,
  GetSingleBuyerReservations,
} from "../controllers/reservationsControllers.js";

router.route("/buyer").get(authMiddleware, GetSingleBuyerReservations);
router.route("/").get(authMiddleware, GetAllBuyerReservations);
router
  .route("/:id")
  .post(authMiddleware, CreateBuyerReservations)
  .put(authMiddleware, UpdateBuyerReservations)
  .delete(authMiddleware, DeleteBuyerReservations);

export default router;
