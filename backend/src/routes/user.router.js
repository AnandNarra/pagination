import express from 'express';
import { loginUser, registerUser } from '../controller/user.controller.js';
import { createProduct, getTotalProducts } from '../controller/product.controller.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser)


//products

router.post("/addProduct", createProduct)

router.get('/getTotalProducts', getTotalProducts)

export default router