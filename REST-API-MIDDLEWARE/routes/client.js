

/****
 *@Description : Router - API url  hadler configurations.
 *@author Renjith .
 *@license Apache 2.0 
 */
const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { checkLogin } = require('../middleware/auth');


router.post('/authenticate',  clientController.login);
     
router.post('/callsignfromflight', checkLogin,  clientController.callSignFromFlight);

router.post('/flightfromcallsign',  checkLogin, clientController.flightFromCallSign);

router.get('/durationbyiatacode/:code', checkLogin,clientController.airportDuartionByIATACode);
    
router.get('/durationbyicaocode/:code', checkLogin,clientController.airportDuartionByICAOCode);

router.post('/flightduration',checkLogin,clientController.durationFromFlight);

router.post('/orginscheduledatetime',checkLogin,clientController.orginScheduleFromFlight);


module.exports = router;
