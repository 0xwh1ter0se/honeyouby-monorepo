import { Router } from "express";
import authRoutes from "./auth.routes.js";
import productRoutes from "./product.routes.js";
import categoryRoutes from "./category.routes.js";
import orderRoutes from "./order.routes.js";
import reviewRoutes from "./review.routes.js";
import blogRoutes from "./blog.routes.js";
import carouselRoutes from "./carousel.routes.js";
import contactRoutes from "./contact.routes.js";
import financeRoutes from "./finance.routes.js";
import userRoutes from "./user.routes.js";

const router = Router();

// Mount all routes
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/orders", orderRoutes);
router.use("/reviews", reviewRoutes);
router.use("/blogs", blogRoutes);
router.use("/carousels", carouselRoutes);
router.use("/contact", contactRoutes);
router.use("/finance", financeRoutes);
router.use("/user", userRoutes);

export default router;

