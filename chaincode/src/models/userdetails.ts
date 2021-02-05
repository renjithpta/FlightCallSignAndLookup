
import { Object, Property } from 'fabric-contract-api';

@Object()
export class UserDetails {

    @Property()
    public userName: string;

    @Property()
    public password : string;


    @Property()
    public orgName :string;


    @Property()
    public docType : string = 'User';




}