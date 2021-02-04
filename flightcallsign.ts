
import { Object, Property } from 'fabric-contract-api';

@Object()
export class FlightCallsign {

    @Property()
    public scheduleOperatorCode: string;


    @Property()
    public scheduleFlightNumber : string;


    @Property()
    public callsignOperatorCode :string;

     
    @Property()
    public callsignFlightNumber :string;

    @Property()
    public arrivalOrDepature : string ;

   
    @Property()
    public validFrom : string ;

    
    @Property()
    public validUntil : string ;


    @Property()
    public docType : string = 'CallSign';



}