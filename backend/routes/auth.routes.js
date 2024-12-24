import express from "express";
import { signup } from "../controllers/auth.Controllers.js";
const router= express.Router();

router.post('/login');

router.post('/signup',signup);

router.post('/logout')
export default router;