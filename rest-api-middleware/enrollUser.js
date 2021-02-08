'use strict';

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const path = require('path');
const fs = require('fs');


//connect to the config file
const configPathPrefix = path.join(process.cwd(), 'config');
const walletPathPrefix = path.join(process.cwd(), '_idwallet');
const configPath = path.join(configPathPrefix, 'config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);
let   connection_file = config.connection_file;
let gatewayDiscovery  = config.gatewayDiscovery;
let appAdmin          = config.appAdmin;
let orgMSPID          = config.orgMSPID;
let channelName       = config.channel_name;
let smartContractName = config.smart_contract_name;
let peerAddr          = config.peerName;

// connect to the connection file
const ccpPath = path.join(configPathPrefix, connection_file);
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

const userName =  process.argv[2];

const password =  process.argv[2];

async function registerUser() {

    if (!userName || !password ) {
        let response = {};
        response.err = 'Error! You need to fill all fields before you can register!';
        return response;
    }

    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(walletPathPrefix);
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(userName);
        if (userExists) {
            let response = {};
            console.error(`An identity for the user ${userName} already exists in the wallet`);
            response.err = `Error! An identity for the user ${userName} already exists in the wallet.`;
            return response;
        }

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists(appAdmin);
        if (!adminExists) {
            console.error(`An identity for the admin user ${appAdmin} does not exist in the wallet`);
            console.log('Run the enrollAdmin.js application before retrying');
            let response = {};
            response.err = `An identity for the admin user ${appAdmin} does not exist in the wallet. 
              Run the enrollAdmin.js application before retrying`;
            return response;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: appAdmin, discovery: gatewayDiscovery });

        // Get the CA client object from the gateway for interacting with the CA.
        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({ enrollmentID: userName, role: password }, adminIdentity);
        const enrollment = await ca.enroll({ enrollmentID: userName, enrollmentSecret: secret });
        const userIdentity = await X509WalletMixin.createIdentity(orgMSPID, enrollment.certificate, enrollment.key.toBytes());
        await wallet.import(userName, userIdentity);
        console.log(`Successfully registered user ${userName}. Use userName ${userName} to login above.`);
        let response = `Successfully registered user ${userName} . Use userName ${userName} to login above.`;
        return response;
    } catch (error) {
        console.error(`Failed to register user + ${userName} + : ${error}`);
        let response = {};
        response.err = error;
        return response;
    }
};


registerUser();