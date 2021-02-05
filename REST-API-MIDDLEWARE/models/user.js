
/*
@swagger
 components:
   schemas:
     User:
       type: object
       required:
         - username
         - password
         
       properties:
         username:
           type: string
           description: The username
         password:
           type: string
         
       example:
          username: username
          password: password
          
*/
exports.User  = {
  
    type: "Objcet" ,
    "properties"  :{


    username: { type: "string"  },
    password: {type: "string" }

    }
}



