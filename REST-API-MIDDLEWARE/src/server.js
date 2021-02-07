//Server File


/****
 *@Description : Server port starter.
 *@author Renjith .
 *@license Apache 2.0 
 */
const app = require('./app');
const colors = require("colors") 
app.listen(process.env.PORT_API || 5000, function(err){
    console.log(`Serever running on port ${process.env.PORT_API}`.yellow.bold)
});