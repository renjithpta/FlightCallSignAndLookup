/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { Airportcallsign } from './airportcallsign';
import { FlightCallsign} from './models/flightcallsign' ;
import { AiportOperators } from './models/airportoperators' ;
import { AirportLocations } from './models/airportlocations' ;
import { FlightDurations } from './models/flightdurations' ;
import { HelperUtill} from  './airportCallSignHelper' ;
import { UserDetails } from './models/userdetails';
import  { Iterators} from  'fabric-shim'
import { exception } from 'console';

@Info({title: 'AirportcallsignContract', description: 'My Smart Contract' })
export class AirportcallsignContract extends Contract {
 
    async getAllResults(iterator : Iterators.StateQueryIterator): Promise<any[]>  
    {
        let allResults: any = [];
        while (true) {
          let res = await iterator.next();
    
          if (res.value && res.value.value.toString()) {
            let jsonRes : any= {};
            console.log(res.value.value.toString('utf8'));
    
            
              
              try {
                jsonRes = JSON.parse(res.value.value.toString('utf8'));
              } catch (err) {
                console.log(err);
                
              }
            
            allResults.push(jsonRes);
          }
          if (res.done) {
            console.log('end of data');
            await iterator.close();
            console.info(allResults);
            return allResults;
          }
        }
      } 

      @Transaction(false)
      @Returns('string')
      public async callSignFromFlight(ctx: Context, scheduleFlight : string , scheduleDate : string , arrivalOrDept : string) : Promise<string>{

        console.log('==== start ==== callSignFromFlight' , scheduleFlight ,  scheduleDate , arrivalOrDept);
        if(scheduleDate.length != 8) {
            throw new exception( "Invalid date format input" );
        }
        let selector = HelperUtill.createcallSignSlecetor(scheduleFlight, scheduleDate  , arrivalOrDept ) ;
        console.log(" Selector" ,selector ) ;
        let resultsIterator = await ctx.stub.getQueryResult(selector);
        let results : any[] = await this.getAllResults(resultsIterator);
        if(results.length > 0) {

            return results[0].callsignOperatorCode + results[0].callsignFlightNumber ;

        }else {
          
            let iataCode : string  = scheduleFlight.substr(0,2) ;
            let icaoCode : string  = scheduleFlight.substr(0, 3) ;
            let isNumericIcao = HelperUtill.isNumber(icaoCode.charAt(2));
            if(isNumericIcao) {
                let icaocodeLookUp   = await this.getICAOCode(ctx, iataCode) ;
                if(icaocodeLookUp.length > 1) { 
                    return icaocodeLookUp + scheduleFlight.substr(2); 
                }else{
                    return scheduleFlight ;
                }
            }else {

                   return scheduleFlight ;
            }


        }
      }


      @Transaction(false)
      @Returns('string')
      public async flightFromCallSign(ctx: Context, callSign : string , scheduleDate : string , arrivalOrDept : string) : Promise<string>{

        console.log('==== start ==== flightFromCallSign' , callSign ,  scheduleDate , arrivalOrDept);
        if(scheduleDate.length != 8) {
            throw new exception( "Invalid date format input" );
        }
        let selector = HelperUtill.createFlightFromcallSign(callSign, scheduleDate  , arrivalOrDept ) ;
        console.log(" Selector" ,selector ) ;
        let resultsIterator = await ctx.stub.getQueryResult(selector);
        let results : any[] = await this.getAllResults(resultsIterator);

        if(results.length > 0) {

            return results[0].scheduleOperatorCode + results[0].scheduleFlightNumber ;

        }else {
          
           return callSign ;
        }
      }
          
      @Transaction(false)
      @Returns('string')
      public async getAirportDuartionByIATACode(ctx: Context, iataCode : string) : Promise<string>{


        console.info('=======Start======= getAirportDurationByIataCode =======:\n' );
        let selector = HelperUtill.createDurationSelectorIATAAirportCode(iataCode) ;
        console.log(" Selector" ,selector ) ;
        let resultsIterator = await ctx.stub.getQueryResult(selector);
        let results : any[] = await this.getAllResults(resultsIterator);
        if(results.length > 0)
        return results[0].duration;
         else 
         return "";
      }

      @Transaction(false)
      @Returns('string')
      public async getAirportDuartionByICAOCode(ctx: Context, icaoCode : string) : Promise<string>{

        console.info('=======Start======= getAirportDuartionByICAOCode =======:\n' );
        let selector = HelperUtill.createDurationSelectorICAIAirportCode(icaoCode) ;
        console.log(" Selector" ,selector ) ;
        let resultsIterator = await ctx.stub.getQueryResult(selector);
        let results : any[] = await this.getAllResults(resultsIterator);
        if(results.length > 0)
        return results[0].duration;
         else 
         return "";
      }

      @Transaction(false)
      @Returns('string')
      public async getDurationFromFlight(ctx: Context, scheduledFlight : string, scheduledDate: string , iataAirportCode: string) : Promise<string>{


        console.info('=======Start======= getDurationFromFlight =======:\n' );
         if(scheduledDate.length !== 8) throw new exception("Invalid date format");
        let day =  HelperUtill.getDayFromDateString(scheduledDate);
        let selector = HelperUtill.cretaeDurationFromFlightSelector(scheduledFlight, day,iataAirportCode ) ;
        console.log(" Selector" ,selector ) ;
        let resultsIterator = await ctx.stub.getQueryResult(selector);
        let results : any[] = await this.getAllResults(resultsIterator);

        if(results.length > 0){
          
            let duration  = results[0].duration;
            return HelperUtill.formtDuration(duration);

        }else {
         return "0000";
        }
      }

      @Transaction(false)
      @Returns('string')
      public async getOrginScheduleFromFlight(ctx: Context, scheduledFlight : string, scheduledDate: string , iataAirportCode: string) : Promise<string>{


        console.info('=======Start======= getOrginScheduleFromFlight =======:\n' );
         if(scheduledDate.length !== 12) throw new exception("Invalid date format");
        let day =  HelperUtill.getDayFromHourMinuteDateString(scheduledDate);
        let selector = HelperUtill.cretaeDurationFromFlightSelector(scheduledFlight, day,iataAirportCode ) ;
        console.log(" Selector" ,selector ) ;
        let resultsIterator = await ctx.stub.getQueryResult(selector);
        let results : any[] = await this.getAllResults(resultsIterator);
        let duration = "";
        if(results.length > 0){

         duration =  results[0].duration;

        }else {
            
         duration = await this.getAirportDuartionByIATACode(ctx, iataAirportCode);
        

        }
        if(duration.trim().length > 0)
        return HelperUtill.calculateDurationFromSchduleTime(scheduledDate, duration);
         else
        return scheduledDate;
         
      }








      @Transaction(false)
      @Returns('string')
      public async getICAOCode(ctx: Context, iataCode : string) : Promise<string>{


        console.info('=======Start======= getICAOCode =======:\n' );
        let selector = HelperUtill.createICAOCodeSelector(iataCode) ;
        console.log(" Selector" ,selector ) ;
        let resultsIterator = await ctx.stub.getQueryResult(selector);
        let results : any[] = await this.getAllResults(resultsIterator);
        if(results.length > 0)
         return results[0].icaoCode;
         else 
        return "";
      }



    @Transaction(false)
    @Returns('boolean')
    public async isExits(ctx: Context, key: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(key);
        return (!!buffer && buffer.length > 0);
    }

    
    @Transaction()
    public async createAirportcallSign(ctx: Context, scheduleOperatorCode: string , scheduleFlightNumber : string , 
                                       callsignOperatorCode: string, callsignFlightNumber: string, arrivalOrDepature : string ,
                                       validFrom: string, validTo: string): Promise<boolean> {

        const callSignkey = HelperUtill.createCallSignKey(scheduleOperatorCode + scheduleFlightNumber,callsignOperatorCode + callsignFlightNumber,arrivalOrDepature , validFrom);
        const exists = await this.isExits(ctx, callSignkey);
        if (exists) {
            throw new Error(`The flightcallsign  ${callSignkey} already exists`);
        }
       
        const airportcallsign = new FlightCallsign();
        airportcallsign.scheduleOperatorCode = scheduleOperatorCode;
        airportcallsign.scheduleFlightNumber = scheduleFlightNumber;
        airportcallsign.callsignOperatorCode = callsignOperatorCode ;
        airportcallsign.callsignFlightNumber = callsignFlightNumber ;
        airportcallsign.arrivalOrDepature    = arrivalOrDepature ;
        airportcallsign.validFrom            = validFrom ;
        airportcallsign.validUntil           = validTo;
        console.log("after21")
        const buffer = Buffer.from(JSON.stringify(airportcallsign));
        console.log("after3")
        await ctx.stub.putState(callSignkey, buffer);
        return true;
    }




    @Transaction()
    public async createAiportOperators(ctx: Context, iataCode: string , icaoCode : string ): Promise<boolean> {

        let key  = iataCode + "-" + icaoCode + "-" + "airline";
        const exists = await this.isExits(ctx, key);

        if (exists) {
            throw new Error(`The airportoperators  ${key} already exists`);
        }
        const aiportOperators = new AiportOperators();
        aiportOperators.iataCode = iataCode;
        aiportOperators.icaoCode = icaoCode;
        const buffer = Buffer.from(JSON.stringify(aiportOperators));
        await ctx.stub.putState(key, buffer);
        return true;
    }


     
    @Transaction()
    public async createAirportLocations(ctx: Context, iataCode: string , icaoCode : string , duration : string): Promise<boolean> {

        const airportLocations = new AirportLocations();
        let key  = iataCode + "-" + icaoCode + "-" + "airport";
        const exists = await this.isExits(ctx, key);

        if (exists) {
            throw new Error(`The airportlocations  ${key} already exists`);
        }
        
        airportLocations.iataCode = iataCode;
        airportLocations.icaoCode = icaoCode;
        airportLocations.duration = duration ;
        const buffer = Buffer.from(JSON.stringify(airportLocations));
        await ctx.stub.putState(key, buffer);
        return true;
    }
    
    @Transaction()
    public async createFlightDuration(ctx: Context, scheduleOperatorCode: string , arrivalOrDepature : string , 
                                                    daysOfOperation : string, duration : string , departureAirportIATACode : string): Promise<boolean> {
        
        let key  = scheduleOperatorCode + "-" +  daysOfOperation + "-" +departureAirportIATACode + "-" + arrivalOrDepature;
        const exists = await this.isExits(ctx, key);
        if (exists) {
            throw new Error(`The airportlocations  ${key} already exists`);
        }
        const flightDuration = new FlightDurations();
        flightDuration.scheduleOperatorCode = scheduleOperatorCode;
        flightDuration.arrivalOrDepature    = arrivalOrDepature;
        flightDuration.daysOfOperation      = daysOfOperation;
        flightDuration.duration             = duration ;
        flightDuration.departureAirportIATACode = departureAirportIATACode ;
        const buffer = Buffer.from(JSON.stringify(flightDuration));
        await ctx.stub.putState(key, buffer);
        return true;
    }




    @Transaction()
    public async createUserDetails(ctx: Context, userName: string , passWord : string  , orgName: string): Promise<boolean> {

        let key  = userName + "-" + passWord ;
        const exists = await this.isExits(ctx, key);

        if (exists) {
            throw new Error(`A user with  ${key} already exists`);
        }
        const user = new UserDetails();
        user.userName = userName;
        user.password = passWord;
        user.orgName  = orgName;
        const buffer = Buffer.from(JSON.stringify(user));
        await ctx.stub.putState(key, buffer);
        return true;
    }
    




    

    @Transaction(false)
    @Returns('FlightCallsign')
    public async redaUserDetails(ctx: Context, key: string): Promise<UserDetails> {
        const exists = await this.isExits(ctx, key);
        if (!exists) {
            throw new Error(`The user with key ${key} does not exist`);
        }
        const buffer = await ctx.stub.getState(key);
        const userdetails = JSON.parse(buffer.toString()) as UserDetails;
        return userdetails;
    }
 

    @Transaction(false)
    @Returns('FlightCallSign')
    public async readAirportcallSign(ctx: Context, flightCallsignKey: string): Promise<FlightCallsign> {
        const exists = await this.isExits(ctx, flightCallsignKey);
        if (!exists) {
            throw new Error(`The flightcallsign ${flightCallsignKey} does not exist`);
        }
        const buffer = await ctx.stub.getState(flightCallsignKey);
        const airportcallsign = JSON.parse(buffer.toString()) as FlightCallsign;
        return airportcallsign;
    }

    @Transaction(false)
    @Returns('AirportLocations')
    public async readAirportLocations(ctx: Context, airportLocationsKey: string): Promise<AirportLocations> {
        const exists = await this.isExits(ctx, airportLocationsKey);
        if (!exists) {
            throw new Error(`The airportlocations ${airportLocationsKey} does not exist`);
        }
        const buffer = await ctx.stub.getState(airportLocationsKey);
        const airportLocations = JSON.parse(buffer.toString()) as AirportLocations;
        return airportLocations;
    }


    @Transaction(false)
    @Returns('FlightDurations')
    public async readFlightDurations(ctx: Context, flightDurationsKey: string): Promise<FlightDurations> {
        const exists = await this.isExits(ctx, flightDurationsKey);
        if (!exists) {
            throw new Error(`The flightdurations ${flightDurationsKey} does not exist`);
        }
        const buffer = await ctx.stub.getState(flightDurationsKey);
        const flightDurations = JSON.parse(buffer.toString()) as FlightDurations;
        return flightDurations;
    }


    @Transaction(false)
    @Returns('AiportOperators')
    public async readAiportOperators(ctx: Context, aiportOperatorsKey: string): Promise<AiportOperators> {
        const exists = await this.isExits(ctx, aiportOperatorsKey);
        if (!exists) {
            throw new Error(`The aiportOperators ${aiportOperatorsKey} does not exist`);
        }
      const buffer = await ctx.stub.getState(aiportOperatorsKey);
      const aiportOperators = JSON.parse(buffer.toString()) as AiportOperators;
       return aiportOperators;
    }

    @Transaction()
    public async deleteData(ctx: Context, key: string): Promise<void> {
        const exists = await this.isExits(ctx, key);
        if (!exists) {
            throw new Error(`Sorry. The record not found for the key ${key} `);
        }
        await ctx.stub.deleteState(key);
    }




    @Transaction(false)
    @Returns('boolean')
    public async airportcallsignExists(ctx: Context, airportcallsignId: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(airportcallsignId);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction()
    public async createAirportcallsign(ctx: Context, airportcallsignId: string, value: string): Promise<void> {
        const exists = await this.airportcallsignExists(ctx, airportcallsignId);
        if (exists) {
            throw new Error(`The airportcallsign ${airportcallsignId} already exists`);
        }
        const airportcallsign = new Airportcallsign();
        airportcallsign.value = value;
        const buffer = Buffer.from(JSON.stringify(airportcallsign));
        await ctx.stub.putState(airportcallsignId, buffer);
    }



    

    @Transaction(false)
    @Returns('Airportcallsign')
    public async readAirportcallsign(ctx: Context, airportcallsignId: string): Promise<Airportcallsign> {
        const exists = await this.airportcallsignExists(ctx, airportcallsignId);
        if (!exists) {
            throw new Error(`The airportcallsign ${airportcallsignId} does not exist`);
        }
        const buffer = await ctx.stub.getState(airportcallsignId);
        const airportcallsign = JSON.parse(buffer.toString()) as Airportcallsign;
        return airportcallsign;
    }

    @Transaction()
    public async updateAirportcallsign(ctx: Context, airportcallsignId: string, newValue: string): Promise<void> {
        const exists = await this.airportcallsignExists(ctx, airportcallsignId);
        if (!exists) {
            throw new Error(`The airportcallsign ${airportcallsignId} does not exist`);
        }
        const airportcallsign = new Airportcallsign();
        airportcallsign.value = newValue;
        const buffer = Buffer.from(JSON.stringify(airportcallsign));
        await ctx.stub.putState(airportcallsignId, buffer);
    }

    @Transaction()
    public async deleteAirportcallsign(ctx: Context, airportcallsignId: string): Promise<void> {
        const exists = await this.airportcallsignExists(ctx, airportcallsignId);
        if (!exists) {
            throw new Error(`The airportcallsign ${airportcallsignId} does not exist`);
        }
        await ctx.stub.deleteState(airportcallsignId);
    }

}
