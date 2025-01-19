import express from 'express';
import { signUp, signIn, signOut, newAccessToken } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);
router.post('/refresh', newAccessToken);

export default router;