/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity } from 'fabric-shim';
import { AiportOperators } from './models/airportoperators' ;
import { AirportLocations } from './models/airportlocations' ;
import { FlightDurations } from './models/flightdurations' ;
import { HelperUtill} from  './chaincodeUtil' ;

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import winston = require('winston');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext implements Context {
    public stub: sinon.SinonStubbedInstance<ChaincodeStub> = sinon.createStubInstance(ChaincodeStub);
    public clientIdentity: sinon.SinonStubbedInstance<ClientIdentity> = sinon.createStubInstance(ClientIdentity);
    public logging = {
        getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
        setLevel: sinon.stub(),
     };
}

describe('AirportcallsignContract', () => {

    let contract: AiportOperators;
    let ctx: TestContext;

    beforeEach(() => {
        contract = new AiportOperators();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('BABAW').resolves(Buffer.from('{"IATACode":"BA" , "ICAOCode" : "RE"}'));
        
    });

  

});
