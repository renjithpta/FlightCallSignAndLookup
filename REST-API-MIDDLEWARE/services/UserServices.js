
/****
 *@Description : User details finding. 
 *@author Renjith .
 *@license Apache 2.0 
 */
const users = [ {"username" : "fly2plan" , "password" : "pass"}]


exports.getUser= function(username, password) {
  let response = {"valid" : false,"username" : "" ,"password" : ""} ;

  for(let i = 0 ; i <  users.length ; i++) {

    if(users[i].username === username.trim() && users[i].password === password.trim()) {
        response.valid = true;
        response.username = username ;
        response.password = password ;
        break;
    }
  }
     return response;
}
