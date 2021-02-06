
/****
 *@Description : JWT verifier middleware
 *@author Renjith .
 *@license Apache 2.0 
 *
 */
const jwt = require('jsonwebtoken');

exports.checkLogin = (req, res, next) => {


    console.log("=======" + req.headers.authorization)

    const userToken =( (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))? (req.headers.authorization.split(" ")[1] ): undefined);
   
    if (!userToken) {

        return res.status(401).send({ message: 'Invalid login/password' });

    }

    try {

      const decoded =   jwt.verify(userToken, process.env.PRIVATE_KEY);
      req.username  =   decoded.username ;
    } catch (error) {
        return res.status(401).send({ message: 'Invalid login/password' });
    }

    next();
};