

exports.swaggerDocs = function() {

 let codeRepo ='https://gitlab.com/renjithpta/callsign_and_duration_lookup/-/tree/master';

 let decription =   '<p>This is the REST API  to interface with the the callsign and duration lookup chaincode running on the HLF DLT platform. The REST api use the fabric-sdk api to interact with the chaincode functions.</p>' +
        '<p><h4>API Authorisation</h4> To call the API, you must authorize using username and password. eg . ibs and pass. The authorize response will have an accessToken field . This access token will be  passed in via an header field as  Authorization: Bearer ACCESTOKEN. E.g -H "Authorization: Bearer TOKEN"</p>' +
        '<p>Here, click Authorize button and eneter the token in the authorize field before accessing the other rest API services.</p>' +
        '<p><h4>Code Repo: </h4> Click the <a href="https://gitlab.com/renjithpta/callsign_and_duration_lookup/-/tree/master">Link</a> </p>'+
        '<p>HLF DLT is loaded with reference data from AODB. The reference data exported from AODB as CSV . The data import service read, parse and load the data into DLT. </p>';

   let doc=  {
    "swagger": "2.0",
    "info": {
        "version": "1.0.0",
        "title": "REST API to access callsign and duration  lookup  chaincode .",
        "description": decription,
        "license": {
            "name": "Apache 2.0 LICENSE",
     
            "URL" : "https://www.apache.org/licenses/LICENSE-2.0"

        }
    },
    "host": "13.235.23.226:5000",
    "basePath": "/v1/api/lookupandduration",
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
                "summary": "Get the JWT bearer token as API key . Use ibs and pass as credentials.",
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
                "summary": "Get the callsign from flight code , scheduledate(DDMMYYYY) and arrival or depature indicator. e.g BA095,19012021,D",
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
                "summary": "Get the flight from the callsign , scheduledate(DDMMYYYY) and arrival or depature indicator. e.g BA095,19012021,D",
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
                "summary": "Get the flight duration  from the input scheduledFlight , scheduledDate(DDMMYYYY) and IATA Airportcode. e.g. BA188, 19012021 , EWR .",
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
                "summary": "Get the flight orgin dpearture date and time in HHMMDDMMYYYY fromat  from the input scheduledFlight , scheduledDate(HHMMDDMMYYYY) and IATA Airportcode.e.g. BA074, 045019012021 , LOS .",
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

                "summary": "Get the duration by the airport iata code . e.g SYD",
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

                "summary": "Get the duration by the airport ICAO code. e.g YPPH ",
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