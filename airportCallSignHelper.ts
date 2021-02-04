export class HelperUtill {




   public static createCallSignKey( scheduleOperatorCode : string , callsignOperatorCode : string , 
                                    arrivalOrDepature : string ,     validFrom : string ) : string {

       let key = scheduleOperatorCode +  "-" + callsignOperatorCode + "-" + arrivalOrDepature + "-" + validFrom ;
        return key ;

   }


   public  static isNumber(n : string) : boolean { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); } 

    
   public static createICAOCodeSelector(iataCode : string ): string {

     let selectorQuery =  {
         "selector": {
            "docType": {
               "$eq": "AirlineOP"
            },
            "iataCode": iataCode
         }
      } ;
                
     return JSON.stringify(selectorQuery);


   
   }
    
   /**
    * 
    * @param dateString  Get day form datestring of the format DDMMYYYY
    * @return number  :0-6 fro weedays
    */
   public static getDayFromDateString(dateString : string) : number {

      let dateval  = Number(dateString.substr(0,2).trim());
      let monthval = Number(dateString.substr(2,2).trim()) - 1;
      let yearVal  = Number(dateString.substr(4)) ;
      
      let currentDate = new Date() ;
       
         currentDate.setUTCFullYear(yearVal) ;
         currentDate.setUTCMonth(monthval) ;
         currentDate.setUTCDate(dateval);
      
       return  currentDate.getUTCDay()
     

   }

   /**
    * @param dateString  Get day form datestring of the format HHMMDDMMYYYY
    * @return number  :0-6 fro weedays
    */
   public static getDayFromHourMinuteDateString(dateString : string) : number {

      let dateval  = Number(dateString.substr(4,2).trim());
      let monthval = Number(dateString.substr(6,2).trim()) - 1;
      let yearVal  = Number(dateString.substr(8)) ;
      
      let currentDate = new Date() ;
       
         currentDate.setUTCFullYear(yearVal) ;
         currentDate.setUTCMonth(monthval) ;
         currentDate.setUTCDate(dateval);
      
       return  currentDate.getUTCDay()
     

   }



   /**
    * @param dateString   format HHMMDDMMYYYY
    * @param duration     HHMM
    * @return date  :0-6 fro weedays
    */
   public static calculateDurationFromSchduleTime(dateString : string , duration : string) : string {
      
      let scheduledHours = Number(dateString.substr(0,2).trim());
      let scheduledMinutes = Number(dateString.substr(2,2).trim());
      let dateval  = Number(dateString.substr(4,2).trim());
      let monthval = Number(dateString.substr(6,2).trim()) - 1;
      let yearVal  = Number(dateString.substr(8)) ;
      let hours = 0;
      let minutes = 0;
      if(duration.length < 3) minutes = Number(duration.trim());
   
      if(duration.length === 3)  {
          hours   = Number(duration.trim().substr(0,1));
          minutes = Number(duration.trim().substr(1,2));
      }
      if(duration.length === 4)  {
         hours   = Number(duration.trim().substr(0,2));
         minutes = Number(duration.trim().substr(2,2));
     }
     
      let currentDate = new Date() ;
         currentDate.setUTCFullYear(yearVal) ;
         currentDate.setUTCMonth(monthval) ;
         currentDate.setUTCDate(dateval);
         currentDate.setUTCHours(scheduledHours);
         currentDate.setUTCMinutes(scheduledMinutes);
         currentDate.setUTCSeconds(0);
         currentDate.setUTCMilliseconds(0);
         let beforeDate = currentDate.toISOString()
         currentDate.setUTCMinutes(currentDate.getUTCMinutes() - minutes);
         currentDate.setUTCHours(currentDate.getUTCHours() - hours);
         
         let newDate = currentDate.getUTCDate().toString();
         if(newDate.length === 1) newDate = "0"+ newDate ;
         let newMonth = (currentDate.getUTCMonth() + 1 ).toString();
         if(newMonth.length === 1) newMonth = "0"+ newMonth ;
         let newyear = currentDate.getUTCFullYear().toString();
         let newHours = currentDate.getUTCHours().toString();
         if(newHours.length === 1) newHours ="0"+ newHours;
         let newMinutes = currentDate.getUTCMinutes().toString();
         if(newMinutes.length === 1) newMinutes ="0"+ newMinutes;

        return newHours+newMinutes+newDate+newMonth+newyear;
     

   }

   public static formtDuration(duration: string) : string {

     for(let i =duration.length ; i<4 ; i++)
         duration =  "0"+ duration ;
       
     return duration ;
   }


   public static createDurationSelectorIATAAirportCode(iataAirportCode : string) : string {
      


     let selector = {
         "selector": {
            "docType": {
               "$eq": "AirportLoc"
            },
            "iataCode": iataAirportCode.trim()
         }
      } ;
      
      return JSON.stringify(selector);

   }


   public static createDurationSelectorICAIAirportCode(icaoAirportCode : string) : string {


      let selector = {
                         "selector": {
                              "docType": {
                                 "$eq": "AirportLoc"
                              },
                           "icaoCode": icaoAirportCode.trim()
                        }
                     } ;
       
       return JSON.stringify(selector);
 
    }
    
    public static cretaeDurationFromFlightSelector(scheduledFlight :string, scheduleDay : number, iataAirport :string) : string {

     let operationDays = [ "1000000" ,"0100000" , "0010000", "0001000", "0000100" , "0000010" , "0000001"] ;
         let day  = operationDays[scheduleDay] ;
      let selector = {
         "selector": {
            "docType": {
               "$eq": "FlightDurations"
            },
            "scheduleOperatorCode": {
               "$eq": scheduledFlight
            },
            "arrivalOrDepature": "A",
            "departureAirportIATACode": iataAirport,
            "$or": [
               {
                  "daysOfOperation": {
                     "$eq": "1111111"
                  }
               },
               {
                  "daysOfOperation": {
                     "$eq": day
                  }
               }
            ]
         }
      };

      return JSON.stringify(selector);

    }






    public static createFlightFromcallSign(callSignFlight: string , scheduleDate : string , arrivalOrDepature : string ) : string {

      let callSignCode : string  = "" ;
      let callSignFlightNo : string  = "";
      
      let scheduleDateUTC = scheduleDate.substr(4).trim() + "-" + scheduleDate.substr(2, 2).trim() + "-" + scheduleDate.substr(0, 2).trim();
          scheduleDateUTC = scheduleDateUTC + "T00:00:00.000Z"
      
      if(callSignFlight.length >3) { callSignCode = callSignFlight.substr(0,3) ; callSignFlightNo =  callSignFlight.substr(3) ; }

      let selector = {
         "selector": {
            "docType": {
               "$eq": "CallSign"
            },
            "validFrom": {
               "$lt": scheduleDateUTC
            },
            "validUntil": {
               "$gt": scheduleDateUTC
            },
            "arrivalOrDepature": arrivalOrDepature,
            "$and": [
               {
                  "callsignOperatorCode": {
                     "$eq": callSignCode
                  }
               },
               {
                  "callsignFlightNumber": {
                     "$eq": callSignFlightNo
                  }
               }
            ]
         }
      } ;

      return JSON.stringify(selector);

    }



    public static createcallSignSlecetor(scheduleFlight : string , scheduleDate : string , arrivalOrDept : string) : string{
     
      let iataCode : string  = "" ;
      let icaoCode : string  = "";      let iataFlightNumber : string ="";
      let icaoFlightNumber : string = "";
      let scheduleDateUTC = scheduleDate.substr(4).trim() + "-" + scheduleDate.substr(2, 2).trim() + "-" + scheduleDate.substr(0, 2).trim();
          scheduleDateUTC = scheduleDateUTC + "T00:00:00.000Z"
      if(scheduleFlight.length >2) { iataCode = scheduleFlight.substr(0,2) ; iataFlightNumber =  scheduleFlight.substr(2) ; }

      if(scheduleFlight.length >3) { icaoCode = scheduleFlight.substr(0,3) ; icaoFlightNumber =  scheduleFlight.substr(3) ; }

      let  selectorQuery  = {

         "selector": {
            "docType": {
               "$eq": "CallSign"
            },
            "arrivalOrDepature": arrivalOrDept.trim().toUpperCase(),
            "validFrom": {
               "$lt": scheduleDateUTC
            },
            "validUntil": {
               "$gt":  scheduleDateUTC
            },
            "$or": [
               {
                  "$and": [
                     {
                        "scheduleFlightNumber": {
                           "$eq": iataFlightNumber
                        }
                     },
                     {
                        "scheduleOperatorCode": {
                           "$eq": iataCode
                        }
                     }
                  ]
               },
               {
                  "$and": [
                     {
                        "scheduleFlightNumber": {
                           "$eq": icaoCode
                        }
                     },
                     {
                        "scheduleOperatorCode": {
                           "$eq": icaoFlightNumber
                        }
                     }
                  ]
               }
            ]
         }
      };

          return JSON.stringify(selectorQuery);

    }


}