import express from 'express'

import authentication from './authentication';
import event from './event';
import helpRequest from './help-request';


const router = express.Router()

// anonymous function
export default ():express.Router =>{
    authentication(router)
    event(router)
    helpRequest(router)
    
    return router;
}
