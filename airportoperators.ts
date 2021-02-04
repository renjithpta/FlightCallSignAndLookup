
import { Object, Property } from 'fabric-contract-api';

@Object()
export class AiportOperators {

    @Property()
    public iataCode: string;

    @Property()
    public icaoCode : string;


    @Property()
    public docType : string = 'AirlineOP';

}