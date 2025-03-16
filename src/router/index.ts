import express from 'express'

import authentication from './authentication';


const router = express.Router()

// anonymous function
export default ():express.Router =>{
    authentication(router)
    
    return router;
}
