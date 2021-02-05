
import { Object, Property } from 'fabric-contract-api';

@Object()
export class FlightDurations {

    @Property()
    public scheduleOperatorCode: string;


    @Property()
    public arrivalOrDepature : string ;

   
    @Property()
    public daysOfOperation : string ;

    
    @Property()
    public duration : string ;


    @Property()
    public departureAirportIATACode : string ;


    @Property()
    public docType : string = 'FlightDurations';



}