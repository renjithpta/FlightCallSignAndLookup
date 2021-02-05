const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const colors = require("colors") ;
const networkConnection = require('../utils/networkConnection');
const userService = require("../services/UserServices") ;



exports.login = async (req, res) => {
   

  const  {username, password}  = req.body;
    


    if (!username|| !password) {
        return res.status(401).json({ success: false, message: 'Invalid login/password' });
    }

    let checkUserValidity = userService.getUser(username, password)
    if (!checkUserValidity.valid) {
        return res.status(401).json({ success: false, message: 'Invalid login' });
    }
    const userJWT = jwt.sign({ username }, process.env.PRIVATE_KEY, { algorithm: 'HS256' , expiresIn : '1d' } );
   
        let loginresponse  ={ }

        loginresponse.accessToken = userJWT ;
        loginresponse.success = true;

    return res.json(loginresponse);

};


exports.callSignFromFlight = async (req, res) => {
    console.log(`======start ====callSignFromFlight========PARAMS======= ${req.body.toString()}================`.yellow.bold)
    const { scheduleFlight, scheduleDate, arrivalOrDept } = req.body;
    console.log("Arival dept",arrivalOrDept )
    if(arrivalOrDept !== 'A' && arrivalOrDept !== 'D')   return res.status(400).json({ "error": "Wrong input arrival or depature" });
    if(scheduleDate.length !== 8 || isNaN(scheduleDate)) return res.status(400).json({ "error": "Wrong input date" });

  
    networkConnection
        .evaluateTransaction('callSignFromFlight', "org1", "fly2plan", [scheduleFlight, scheduleDate, arrivalOrDept])
        .then(result => {
            console.log(`=========Received=======${result}====`.bgGreen.bold);
            if (result) {
                if (result.length > 0) {
                   
                    return res.status(200).json({ "callSign": result.toString() });
                }
            }
            return res.status(500).json({ error: 'Something went wrong' });
        })
        .catch((err) => {
            console.log(`=========Error=======${err}====`.bgRed.bold);
            return res.status(500).json({ error: `Something went wrong\n ${err}` });
        });
};




exports.flightFromCallSign = async (req, res) => {


    console.log(`======START ====flightFromCallSign========PARAMS======= ${req.body.toString()}================`.yellow.bold)
    const { callSign, scheduleDate, arrivalOrDept } = req.body;
       
    if(arrivalOrDept !== 'A' && arrivalOrDept !== 'D')   return res.status(400).json({ "error": "Wrong input arrival or depature" });
    if(scheduleDate.length !== 8 || isNaN(scheduleDate)) return res.status(400).json({ "error": "Wrong input date" });
    networkConnection
        .evaluateTransaction('flightFromCallSign', "org1", "fly2plan", [callSign, scheduleDate, arrivalOrDept])
        .then(result => {
            console.log(`=========Received=======${result}====`.bgGreen.bold);
            if (result) {
                if (result.length > 0) {
                 
                    return res.status(200).json({ "scheduledFlight": result.toString() });
                }
            }
            return res.status(500).json({ error: 'Something went wrong' });
        })
        .catch((err) => {
            console.log(`=========Error=======${err}====`.bgRed.bold);
            return res.status(500).json({ error: `Something went wrong\n ${err}` });
        });
};



exports.airportDuartionByIATACode = async (req, res) => {


    console.log(`======START ====airportDuartionByIATACode========PARAMS======= ${req.params.code}================`.yellow.bold)
    

    networkConnection
        .evaluateTransaction('getAirportDuartionByIATACode', "org1", "fly2plan", [req.params.code])
        .then(result => {
            console.log(`=========Received=======${result}====`.bgGreen.bold);
            if (result) {
                if (result.length > 0) {
                 
                    return res.status(200).json({ "duration": result.toString() });
                }
            }
            return res.status(500).json({ error: 'Something went wrong' });
        })
        .catch((err) => {
            console.log(`=========Error=======${err}====`.bgRed.bold);
            return res.status(500).json({ error: `Something went wrong\n ${err}` });
        });
};





exports.airportDuartionByICAOCode = async (req, res) => {

    console.log(`======START ====airportDuartionByICAOCode========PARAMS======= ${req.params.code}================`.yellow.bold)
     networkConnection
        .evaluateTransaction('getAirportDuartionByICAOCode', "org1", "fly2plan", [req.params.code])
        .then(result => {
            console.log(`=========Received=======${result}====`.bgGreen.bold);
            if (result) {
                if (result.length > 0) {
                    
                    return res.status(200).json({ "duration": result.toString() });
                }
            }
            return res.status(500).json({ error: 'Something went wrong' });
        })
        .catch((err) => {
            console.log(`=========Error=======${err}====`.bgRed.bold);
            return res.status(500).json({ error: `Something went wrong\n ${err}` });
        });
};



exports.durationFromFlight = async (req, res) => {
    console.log(`======start ====durationFromFlight========PARAMS======= ${req.body.toString()}================`.yellow.bold)
    const { scheduledFlight, scheduledDate, iataAirportCode } = req.body;
        
    if(scheduledDate.length !== 8 || isNaN(scheduledDate)) return res.status(400).json({ "error": "Wrong input date" });
    networkConnection
        .evaluateTransaction('getDurationFromFlight', "org1", "fly2plan", [scheduledFlight, scheduledDate, iataAirportCode])
        .then(result => {
            console.log(`=========Received=======${result}====`.bgGreen.bold);
            if (result) {
                if (result.length > 0) {
                   return res.status(200).json({ "duration": result.toString() });
                }
            }
            return res.status(500).json({ error: 'Something went wrong' });
        })
        .catch((err) => {
            console.log(`=========Error=======${err}====`.bgRed.bold);
            return res.status(500).json({ error: `Something went wrong\n ${err}` });
        });
};




exports.orginScheduleFromFlight = async (req, res) => {


    console.log(`======start ====orginScheduleFromFlight========PARAMS======= ${req.body.scheduledFlight}================`.yellow.bold)
    const { scheduledFlight, scheduledDate, iataAirportCode } = req.body;
   
   
    if(scheduledDate.length !== 12 || isNaN(scheduledDate)) return res.status(400).json({ "error": "Wrong input date" });
    networkConnection
        .evaluateTransaction('getOrginScheduleFromFlight', "org1", "fly2plan", [scheduledFlight, scheduledDate, iataAirportCode])
        .then(result => {
            console.log(`=========Received=======${result}====`.bgGreen.bold);
            if (result) {
                if (result.length > 0) {
       
                    return res.status(200).json({ "orginDatetime": result.toString() });
                }
            }
            return res.status(500).json({ error: 'Something went wrong' });
        })
        .catch((err) => {
            console.log(`=========Error=======${err}====`.bgRed.bold);
            return res.status(500).json({ success: false, error: `Something went wrong\n ${err}` });
        });
};


