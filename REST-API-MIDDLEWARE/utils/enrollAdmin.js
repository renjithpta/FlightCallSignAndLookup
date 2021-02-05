
'use strict';
const fs = require('fs');
const path = require('path');
const { FileSystemWallet, Gateway, User, X509WalletMixin } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');

const orgName = process.argv[2];

async function main() {

    try {
        let filePathLocal= path.resolve(
            __dirname,
            "..",
            'gateway',
            `config_${orgName}.json`
        );
        await enrollAdmin(orgName.toLowerCase(),filePathLocal , true);
             
    } catch (error) {

        console.error(`Failed to enroll admin user "${orgNumber}": ${error}`);
        process.exit(1);
    }
}

async function enrollAdmin(orgName ,filePathLocal,  bLocalHost= true) {


let   configdata = JSON.parse(fs.readFileSync(filePathLocal, 'utf8'));
let basePath = path.resolve(
    __dirname,
    "..");                     

const walletpath = basePath+configdata["wallet"];
const ccpPath = basePath + configdata["connection_profile_filename"];
var userid = process.env.FABRIC_USER_ID || "admin";
var pwd = process.env.FABRIC_USER_SECRET || "adminpw";
var usertype = process.env.FABRIC_USER_TYPE || "admin";
let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
let orgMSPID  = ccp.client.organization;
// Open path to the identity wallet
let wallet = new FileSystemWallet(walletpath);
const idExists = await wallet.exists(ccp,userid);
if (!idExists) {
    
    console.log(`Enrolling and importing ${userid} into wallet`);
    await enrollUser(ccp, userid, pwd, usertype , ccp.client.organization , wallet);
}




}


async function enrollUser (ccp , userid, userpwd, usertype , orgMSPID , wallet) {
    console.log("\n------------  utils.enrollUser -----------------");
    const orgs = ccp.organizations;
    const CAs = ccp.certificateAuthorities;
    const fabricCAKey = orgs[orgMSPID].certificateAuthorities[0];
    const caURL = CAs[fabricCAKey].url;
    const ca = new FabricCAServices(caURL, { trustedRoots: [], verify: false });
    
    let newUserDetails = {
        enrollmentID: userid,
        enrollmentSecret: userpwd,
        attrs: [
            {
                "name": "usertype", // application role
                "value": usertype,
                "ecert": true
            }]
    };
 

    return ca.enroll(newUserDetails).then(enrollment => {
           var identity = X509WalletMixin.createIdentity(orgMSPID, enrollment.certificate, enrollment.key.toBytes());
        return wallet.import(userid, identity).then(notused => {
            return console.log('msg: Successfully enrolled user, ' + userid + ' and imported into the wallet');
        }, error => {
            console.log("error in wallet.import\n" + error.toString());
            throw error;
        });
    }, error => {
        console.log("Error in enrollment " + error.toString());
        throw error;
    });
}
main();
