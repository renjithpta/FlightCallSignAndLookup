

/*
* @swagger
*  components:
*    schemas:
*      LoginReponse:
*        type: object
*        required:
*          - accessToken
*          - success
*          
*        properties:
*          accessToken:
*            type: string
*            description: the JWT bearer token
*          success:
*            type: boolean
*            description: the success indicator
*           
*        example:
*           username: fly2plan
*           password: pass

 */
exports.LoginResponse  = {
  
    type: "Objcet" ,
    "properties"  :{


    accestoken: { type: "string"  },
    success: {type: "boolean" }

    }
}

