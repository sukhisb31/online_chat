import express from "express";
import { getUser, signin, signout, signup, updateProfile } from "../controllers/user.controller.js";



const router = express.Router();

router.post ("/sign-up", signup);
router.post ("/sign-in", signin);
router.get ("/sign-out", signout);
router.get ("/me", getUser);
router.put ("/update-profile", updateProfile);

export default router;