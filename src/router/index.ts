import express from 'express'

import authentication from './authentication';
import event from './event';


const router = express.Router()

// anonymous function
export default ():express.Router =>{
    authentication(router)
    event(router)
    return router;
}
