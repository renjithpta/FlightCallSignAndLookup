'use strict';

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const path = require('path');
const fs = require('fs');


//connect to the config file

const configPathPrefix = path.join(process.cwd(), 'config');
const walletPathPrefix = path.join(process.cwd(), '_idwallet');
let configPath ;
 if(process.env.NODE_ENV && process.env.NODE_ENV ==='development')
 configPath = path.join(configPathPrefix, 'config.json');
 else
 configPath = path.join(configPathPrefix, 'config-docker.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);
let connection_file = config.connection_file;
let gatewayDiscovery = config.gatewayDiscovery;
let appAdmin = config.appAdmin;
let orgMSPID = config.orgMSPID;
let channelName = config.channel_name;
let smartContractName = config.smart_contract_name;
let peerAddr = config.peerName;
// connect to the connection file
const ccpPath = path.join(configPathPrefix, connection_file);
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

exports.connectToNetwork = async function (userName) {
    const gateway = new Gateway();
    try {
        const walletPath = path.join(walletPathPrefix);
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        const userExists = await wallet.exists(userName);
        if (!userExists) {
            console.error('An identity for the user ' + userName + ' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            let response = {};
            response.err = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
            return response;
        }

        await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });
        const network = await gateway.getNetwork(channelName);
        const contract = await network.getContract(smartContractName);
        const client = gateway.getClient();
        const channel = client.getChannel(channelName);

        let networkObj = {
            contract: contract,
            network: network,
            gateway: gateway
        };
        return networkObj;

    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.error(error.stack);
        let response = {};
        response.err = error;
        return response;
    } finally {
        console.log('Done connecting to network.');
    }
};


//Transaction submit
exports.submitTransction = async function (networkObj, txName, ...args) {
    try {

        let response;


        switch (txName.toString().trim()) {

            case "createAiportOperators":
                response = await networkObj.contract.submitTransaction(txName, args[0], args[1]);
                break;

            case "createAirportLocations":
                response = await networkObj.contract.submitTransaction(txName, args[0], args[1], args[2]);
                break;

            case "createFlightDuration":
                response = await networkObj.contract.submitTransaction(txName, args[0], args[1], args[2], args[3], args[4]);
                break;

            case "createAirportcallSign":
                response = await networkObj.contract.submitTransaction(txName, args[0], args[1], args[2], args[3], args[4], args[5], args[6]);

                break;

        }

        await networkObj.gateway.disconnect();
        console.log("result", response.toString())
        return response.toString();
    } catch (error) {
        console.log(error)
        console.error(`Failed to submit transaction: ${error}`);
        return error;
    }
};



//evaluate submit
exports.query = async function (networkObj, txName, ...args) {
    try {


        let response;


        switch (txName.toString().trim()) {

            case "callSignFromFlight":
                response = await networkObj.contract.evaluateTransaction(txName, args[0], args[1], args[2]);
                break;
            case "flightFromCallSign":
                response = await networkObj.contract.evaluateTransaction(txName, args[0], args[1], args[2]);
                break;

            case "getDurationFromFlight":
                response = await networkObj.contract.evaluateTransaction(txName, args[0], args[1], args[2]);
                break;

            case "getOrginScheduleFromFlight":
                response = await networkObj.contract.evaluateTransaction(txName, args[0], args[1], args[2]);
                break;

            case "callSignFromFlight":
                response = await networkObj.contract.evaluateTransaction(txName, args[0], args[1], arg[2]);
                break;
            case "flightFromCallSign":
                response = await networkObj.contract.evaluateTransaction(txName, args[0], args[1], args[2]);
                break;

            case "getAirportDuartionByICAOCode":
                response = await networkObj.contract.evaluateTransaction(txName, args[0]);
                break;

            case "getAirportDuartionByIATACode":
                response = await networkObj.contract.evaluateTransaction(txName, args[0]);
                break;

        }

        await networkObj.gateway.disconnect();
        return response.toString();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return error.toString();
    }
};

