

exports.swaggerDocs = function() {

   let doc=  {
    "swagger": "2.0",
    "info": {
        "version": "1.0.0",
        "title": "REST API to access Callsign and Duration look .",
        "description": "This is the API defintion to access the callsign and duration lookup chaincode running on HLF. The user access is restricted with JWT token",
        "license": {
            "name": "MIT",
            "url": "https://opensource.org/licenses/MIT"
        }
    },
    "host": "localhost:5000",
    "basePath": "/api/callsignandlookup",
    "tags": [
        {
            "name": "Chaincode API",
            "description": "Call the client acces statrt with base URL api/callsignandlookup"
        }
    ],
    "schemes": [
        "http"
    ],
    "consumes": [
        "application/json"
    ],
    "produces": [
        "application/json"
    ],

    "securityDefinitions": {
        "Bearer": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
            "description": "Enter your bearer token in the format **Bearer &lt;token>**"
          }
    }
    ,
    "security": [{
        "Bearer": []
      }],
    
    "paths": {
        "/authenticate": {
            "post": {
                "tags": [
                    "Users Authentication Access token"
                ],
                "summary": "Get the JWT bearer token",
                "parameters": [
                    {
                        "name": "user",
                        "in": "body",
                        "description": "The User credential for  API access",
                        "schema": {
                            "$ref": "#/definitions/User"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/LoginResponse"
                        }
                    }
                }
            }
        },

        "/callsignfromflight": {
            "post": {
                "tags": [
                    "CallSignFromFlight"
                ],
                "security": [{ "Bearer": [] }],
                "summary": "Get the callsign from flight code , scheduledate(DDMMYYYY) and arrival or depature indicator",
                "parameters": [
                    {
                        "name": "FlightCallSign",
                        "in": "body",
                        "description": "The schduleFlight(ICAO or IATA with Fligh #),scheduleDate(DDMMYYYY) and A or D",
                        "schema": {
                            "$ref": "#/definitions/FlightDetails"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/CallSign"
                        }
                    }
                }
            }
        },
        "/flightfromcallsign": {
            "post": {
                "tags": [
                    "FlightFromCallsign"
                ],
                "security": [{ "Bearer": [] }],
                "summary": "Get the flight from the callsign , scheduledate(DDMMYYYY) and arrival or depature indicator",
                "parameters": [
                    {
                        "name": "CallSignDetails",
                        "in": "body",
                        "description": "The callsign,scheduleDate(DDMMYYYY) and A or D",
                        "schema": {
                            "$ref": "#/definitions/CallSignDetails"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/Flight"
                        }
                    }
                }
            }
        },


        "/flightduration": {
            "post": {
                "tags": [
                    "Flight Duration "
                ],
                "security": [{ "Bearer": [] }],
                "summary": "Get the flight duration  from the input scheduledFlight , scheduledDate(DDMMYYYY) and IATA Airportcode",
                "parameters": [
                    {
                        "name": "FlightDuration",
                        "in": "body",
                        "description": "The model has the attributes cheduledFlight , scheduledDate(DDMMYYYY) and IATA Airportcode",
                        "schema": {
                            "$ref": "#/definitions/FlightDuration"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/Duration"
                        }
                    }
                }
            }

            
    

        },




        "/orginscheduledatetime": {
            "post": {
                "tags": [
                    "Origin Departure Date and Time "
                ],
                "security": [{ "Bearer": [] }],
                "summary": "Get the flight orgin dpearture date and time in HHMMDDMMYYYY fromat  from the input scheduledFlight , scheduledDate(HHMMDDMMYYYY) and IATA Airportcode",
                "parameters": [
                    {
                        "name": "FlightDuration",
                        "in": "body",
                        "description": "The model has the attributes cheduledFlight , scheduledDate(HHMMDDMMYYYY) and IATA Airportcode",
                        "schema": {
                            "$ref": "#/definitions/FlightDuration"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/OrginalDateTime"
                        }
                    }
                }
            }
        },

        "/durationbyiatacode/{code}": {
            "get": {
                "tags": [
                    "Duration by IATA code format(HHMM)"
                ],

                "summary": "Get the duration by the airport iata code ",
                "parameters": [{"name": "code","in": "path","required": true,"description": "IATA airport code","type": "string"}],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/Duration"
                        }
                    }
                }
            }
        },
       

        "/durationbyicaocode/{code}": {
            "get": {
                "tags": [
                    "Duration by ICAO code ( Numeric format HHMM)"
                ],

                "summary": "Get the duration by the airport ICAO code ",
                "parameters": [{"name": "code","in": "path","required": true,"description": "ICAO airport code","type": "string"}],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/Duration"
                        }
                    }
                }
            }
        },


    },
    "definitions": {
        "User": {
            "required": [
                "username",
                "password"
            ],
            "properties": {
                "username": {
                    "type": "string",
                    "uniqueItems": true
                },
                "password": {
                    "type": "string"
                }
            }
        },

        "LoginResponse": {
            "required": [
                "accessToken",
                "success"
            ],
            "properties": {
                "accessToken": {
                    "type": "string"
                },
                "success": {
                    "type": "boolean"
                }
            }
        },
        

        "FlightDetails": {
            "required": [
                "scheduleFlight" ,
                "scheduleDate" ,
                "arrivalOrDept"
            ],
            "properties": {
                "scheduleFlight": {
                    "type": "string"
                },
             "scheduleDate" : {

                "type" : "string"
             } ,
             "arrivalOrDept" : {

                "type" : "string"
             } 
             

            }
        },

        "CallSignDetails": {
            "required": [
                "callSign" ,
                "scheduleDate" ,
                "arrivalOrDept"
            ],
            "properties": {
                "callSign": {
                    "type": "string"
                },
             "scheduleDate" : {

                "type" : "string"
             } ,
             "arrivalOrDept" : {

                "type" : "string"
             } 
             

            }
        },


        "FlightDuration": {
            "required": [
                "scheduledFlight" ,
                "scheduledDate" ,
                "iataAirportCode"
            ],
            "properties": {
                "scheduledFlight": {
                    "type": "string"
                },
             "scheduledDate" : {

                "type" : "string"
             } ,
             "iataAirportCode" : {

                "type" : "string"
             } 
             

            }
        },

       
        "CallSign": {
            "required": [
                "callSign"
            ],
            "properties": {
                "callSign": {
                    "type": "string"
                }
            }
        },
        "Flight": {
            "required": [
                "scheduledFlight"
            ],
            "properties": {
                "scheduledFlight": {
                    "type": "string"
                }
            }
        },

        "Duration": {
            "required": [
                "duration"
            ],
            "properties": {
                "duration": {
                    "type": "string"
                }
            }
        },

        "OrginalDateTime": {
            "required": [
                "orginDatetime"
            ],
            "properties": {
                "orginDatetime": {
                    "type": "string"
                }
            }
        }




    }
};
    return doc ;

}