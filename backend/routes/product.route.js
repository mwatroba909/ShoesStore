import express from 'express';
import { getAllProducts, getRecommendationProducts, createProduct, deleteProduct, getProductsByCategory, changeRemomendationProduct} from '../controllers/product.controller.js';
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, adminRoute, getAllProducts)
router.get('/receomendation', getRecommendationProducts)
router.get('/category/:category', getProductsByCategory)
router.post("/", protectRoute, adminRoute, createProduct)
router.patch("/:id", protectRoute, adminRoute, changeRemomendationProduct)
router.delete("/:id", protectRoute, adminRoute, deleteProduct)


export default router;