
import { Object, Property } from 'fabric-contract-api';

@Object()
export class AirportLocations {

    @Property()
    public iataCode: string;

    @Property()
    public icaoCode : string;


    @Property()
    public duration :string;


    @Property()
    public docType : string = 'AirportLoc';




}