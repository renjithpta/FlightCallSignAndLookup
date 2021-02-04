/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity } from 'fabric-shim';
import { AirportcallsignContract } from '.';

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

    let contract: AirportcallsignContract;
    let ctx: TestContext;

    beforeEach(() => {
        contract = new AirportcallsignContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"airportcallsign 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"airportcallsign 1002 value"}'));
    });

    describe('#airportcallsignExists', () => {

        it('should return true for a airportcallsign', async () => {
            await contract.airportcallsignExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a airportcallsign that does not exist', async () => {
            await contract.airportcallsignExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createAirportcallsign', () => {

        it('should create a airportcallsign', async () => {
            await contract.createAirportcallsign(ctx, '1003', 'airportcallsign 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"airportcallsign 1003 value"}'));
        });

        it('should throw an error for a airportcallsign that already exists', async () => {
            await contract.createAirportcallsign(ctx, '1001', 'myvalue').should.be.rejectedWith(/The airportcallsign 1001 already exists/);
        });

    });

    describe('#readAirportcallsign', () => {

        it('should return a airportcallsign', async () => {
            await contract.readAirportcallsign(ctx, '1001').should.eventually.deep.equal({ value: 'airportcallsign 1001 value' });
        });

        it('should throw an error for a airportcallsign that does not exist', async () => {
            await contract.readAirportcallsign(ctx, '1003').should.be.rejectedWith(/The airportcallsign 1003 does not exist/);
        });

    });

    describe('#updateAirportcallsign', () => {

        it('should update a airportcallsign', async () => {
            await contract.updateAirportcallsign(ctx, '1001', 'airportcallsign 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"airportcallsign 1001 new value"}'));
        });

        it('should throw an error for a airportcallsign that does not exist', async () => {
            await contract.updateAirportcallsign(ctx, '1003', 'airportcallsign 1003 new value').should.be.rejectedWith(/The airportcallsign 1003 does not exist/);
        });

    });

    describe('#deleteAirportcallsign', () => {

        it('should delete a airportcallsign', async () => {
            await contract.deleteAirportcallsign(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a airportcallsign that does not exist', async () => {
            await contract.deleteAirportcallsign(ctx, '1003').should.be.rejectedWith(/The airportcallsign 1003 does not exist/);
        });

    });

});
