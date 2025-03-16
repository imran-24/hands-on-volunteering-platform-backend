import { verifyJWT } from '../middlewares/index';
import { login, logout, me, refresh, register } from '../controllers/authentication'
import express from 'express'

// anonymous function
export default (router: express.Router)=>{
    router.post('/auth/register', register)
    router.post('/auth/login', login)
    router.get("/auth/refresh", refresh);
    router.get("/auth/me", verifyJWT, me);
    router.get("/auth/logout", verifyJWT, logout);

}