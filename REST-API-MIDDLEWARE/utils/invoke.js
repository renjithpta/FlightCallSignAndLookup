
const networkConnection = require('./networkConnection');
const utils = require('./utils.js');
const orgNumber ='org1' ;//process.argv[2];
const userName = 'fly2plan'; //process.argv[3];
const transaction = 'createUserDetails';//process.argv[4];
const params = ['test1','testpass','ibs'];//process.argv[5];

async function main() {
    try {
        let result =  (params)? await networkConnection.submitTransaction(transaction, orgNumber, userName, params) : await networkConnection.submitTransaction(transaction, orgNumber, userName)
       
        console.log('Transaction has been submitted', result);
        utils.disconnectGateway();
        process.exit(1);

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
