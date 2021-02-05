const fs = require('fs');
const path = require('path');
const { FileSystemWallet, Gateway, User, X509WalletMixin } = require('fabric-network');
let   basePath          = path.resolve(__dirname,"csvs");  
const networkConnection = require('./networkConnection');
const utils             = require('./utils.js');
const { time } = require('console');
const orgNumber         ='org1' ;//process.argv[2];
const userName = 'fly2plan'; //process.argv[3];
const transaction = 'createAiportOperators';//process.argv[4];
const orgNumber         ='org1' ;//process.argv[2];
if(process.argv[2] && process.argv[2].trim().length > 1)  orgNumber = process.argv[2];
if(process.argv[3] && process.argv[3].trim().length > 1)  userName = process.argv[3];

async function readAirlineCsv() {

const transaction = 'createAiportOperators';
let csv = fs.readFileSync(basePath+ "/" + "airlines.csv") ;
let contract  = await connectGatewayFromConfig('org1')

console.log(csv)
var array = csv.toString().split("\n");
console.log("======Total======", array.length);
for(let i = 3419  ; i < array.length ; i++) {
    console.log("======start==========", i) ;
     var data = array[i].split(",");
     if(data.length > 1) {
     try{
        data[0] = data[0].trim().replace(/^"|"$/g, '').replace(/"/g, '');
        data[1] = data[1].trim().replace(/^"|"$/g, '').replace(/"/g, '');
        if( data[0].length ==0) data[0] ="";
        if( data[1].length ==0) data[1] ="";

        let result =  await submitTx(contract, transaction, data[0], data[1]);
     }catch(e){

     }
     console.log("======Success==========", i) ;
    }
     console.log("\n");

}
  
}


async function readAirportsCsv() {

    const transaction = 'createAirportLocations';
    let csv = fs.readFileSync(basePath+ "/" + "airports.csv") ;
    let contract  = await connectGatewayFromConfig('org1')
    var array = csv.toString().split("\n");
   console.log(" ==== Total Records========", array.length)
    for(let i = 0  ; i < array.length ; i++) {
    

         var data = array[i].split(",");
         if(data.length >1) {
         try{
            data[0] = data[0].trim().replace(/^"|"$/g, '').replace(/"/g, '');
            data[1] = data[1].trim().replace(/^"|"$/g, '').replace(/"/g, '');
            data[2] = data[2].trim().replace(/^"|"$/g, '').replace(/"/g, '');
            if( data[0].length ==0) data[0] ="";
            if( data[1].length ==0) data[1] ="";
            let result =  await submitTx(contract, transaction,data[0], data[1] , data[2]);
         }catch(e){
             console.log(e)
    
         }

         console.log("===Success ===",i,"\n" );

        }
     
    
    }

    
      
}


async function readFlightDurationsCsv() {

    const transaction = 'createFlightDuration';
    let csv = fs.readFileSync(basePath+ "/" + "flight_durations.csv") ;
    let contract  = await connectGatewayFromConfig('org1')
    var array = csv.toString().split("\n");
   
    for(let i = 0  ; i < array.length ; i++) {
    
         var data = array[i].split(",");
         try{
            data[0] = data[0].trim().replace(/^"|"$/g, '').replace(/"/g, '');
            data[1] = data[1].trim().replace(/^"|"$/g, '').replace(/"/g, '');
            data[2] = data[2].trim().replace(/^"|"$/g, '').replace(/"/g, '');
            data[3] = data[3].trim().replace(/^"|"$/g, '').replace(/"/g, '');
            data[4] = data[4].trim().replace(/^"|"$/g, '').replace(/"/g, '');
            if( data[0].length ==0) data[0] ="";
            if( data[1].length ==0) data[1] ="";
            if( data[2].length ==0) data[2] ="";
            if( data[3].length ==0) data[3] ="";
            if( data[4].length ==0) data[4] ="";
            let result =  await submitTx(contract, transaction,data[0], data[1] , data[2],data[3], data[4]);
         }catch(e){
    
         }
         console.log("\n");
    
    }

    
      
}



async function readCallSignCsv() {

    const transaction = 'createAirportcallSign';
    let contract  = await connectGatewayFromConfig('org1')
    let csv = fs.readFileSync(basePath+ "/" + "callsigns.csv") ;
   
    var array = csv.toString().split("\n");
    console.log(" ===========Toal Records ===============", array.length)
   
    for(let i = 0  ; i < array.length ; i++) {

        if(array[i].trim().length > 4) {
    
         var data = array[i].split(",");
        
        // console.log(data[0].trim(), data[1].trim(), data[2].trim(), data[3].trim(), data[5].trim(),data[4].trim() , data[6].trim())
         
         console.log("Format Date",data[4] );
         data[4] = await formatDate(data[4].trim().replace(/^"|"$/g, '') )
         data[6] = formatToDate(data[6].trim().replace(/^"|"$/g, '') )
    
         try{

            data[0] = data[0].trim().replace(/^"|"$/g, '').replace(/"/g, '');
            data[1] = data[1].trim().replace(/^"|"$/g, '').replace(/"/g, '');
            data[2] = data[2].trim().replace(/^"|"$/g, '').replace(/"/g, '');
            data[3] = data[3].trim().replace(/^"|"$/g, '').replace(/"/g, '');
            data[4] = data[4].trim().replace(/^"|"$/g, '').replace(/"/g, '');
            data[5] = data[5].trim().replace(/^"|"$/g, '').replace(/"/g, '');
            data[6] = data[6].trim().replace(/^"|"$/g, '').replace(/"/g, '')
            if( data[0].length ==0) data[0] ="";
            if( data[1].length ==0) data[1] ="";
            if( data[2].length ==0) data[2] ="";
            if( data[3].length ==0) data[3] ="";
            if( data[4].length ==0) data[4] ="";
            if( data[5].length ==0) data[5] ="";
            if( data[6].length ==0) data[6] ="";

            console.log(data[0].trim(), data[1].trim(), data[2].trim(), data[3].trim(), data[5].trim(),data[4].trim() , data[6].trim())


     
         let result =  await submitTx(contract, transaction,  data[0] , data[1], data[2], data[3], data[5] ,data[4] , data[6] );

        }catch(e){
             console.log(e)
    
         }

         console.log("==== Success ====" ,i);

        }
    
    }

}





async function connectGatewayFromConfig(orgName) {

    let contract;
    let gateway = new Gateway();

    try {

       
       let filePathLocal= path.resolve(
            __dirname,
            "..",
            'gateway',
            `config_${orgName}.json`
        );
      

        const platform =  'LOCAL';
        
            configdata = JSON.parse(fs.readFileSync(filePathLocal, 'utf8'));
            console.log("Platform = " + JSON.stringify(configdata));
            bLocalHost = true;
        
        let basePath = path.resolve(
            __dirname,
            "..");                     
     
        const walletpath = basePath+configdata["wallet"];
        console.log("walletpath = " + walletpath);

        const ccpPath =  basePath + configdata["connection_profile_filename"];
       // const ccpPath = path.resolve(__dirname, configdata["connection_profile_filename"]);
        var userid = process.env.FABRIC_USER_ID || "admin";
        var pwd = process.env.FABRIC_USER_SECRET || "adminpw";
        var usertype = process.env.FABRIC_USER_TYPE || "admin";
        console.log('user: ' + userid + ", pwd: ", pwd + ", usertype: ", usertype);

        // Load connection profile; will be used to locate a gateway
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Set up the MSP Id
        orgMSPID = ccp.client.organization;
        console.log('MSP ID: ' + orgMSPID);

        // Open path to the identity wallet
        wallet = new FileSystemWallet(walletpath);

        const idExists = await wallet.exists(userid);
        if (!idExists) {
            // Enroll identity in the wallet
            console.log(`Enrolling and importing ${userid} into wallet`);
            await utils.enrollUser(userid, pwd, usertype);
        }

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');
        await gateway.connect(ccp, {
            identity: userid, wallet: wallet, discovery: { enabled: true, asLocalhost: bLocalHost }
        });

        // Access channel: channel_name
        console.log('Use network channel: ' + configdata["channel_name"]);

        // Get addressability to the smart contract as specified in config
        network = await gateway.getNetwork(configdata["channel_name"]);
        console.log('Use ' + configdata["smart_contract_name"] + ' smart contract.');

        //  this variable, contract will be used in subsequent calls to submit transactions to Fabric
        contract = await network.getContract(configdata["smart_contract_name"]);
       
    } catch (error) {
        console.log('Error connecting to Fabric network. ' + error.toString());
    } finally {
    }
    return contract;
}


async function submitTx (contract, txName, ...args)  {
    console.log(">>>utils.submitTx..."+txName+" ("+args+")");
    let result = contract.submitTransaction(txName, ...args);
    return result.then (response => {
        // console.log ('Transaction submitted successfully;  Response: ', response.toString());
        console.log ('utils.js: Transaction submitted successfully');
        return Promise.resolve(response.toString());
    },(error) =>
        {
          console.log ('utils.js: Error:' + error.toString());
          return Promise.reject(error);
        });
}




async function formatDate(datevalue) {

    
    console.log(" ======Values========");
    datevalue= datevalue.replace(/^"|"$/g, '') 
    
    let splitarry = datevalue.split(' ') ;

    let datepart = splitarry[0].split("/") ;

    let timepart  = splitarry[1].split(":")



    let date = new Date() ;
 
        date.setUTCFullYear(Number(datepart[2].trim().replace('"'))) ;
        date.setUTCMonth(Number(datepart[1].trim()) - 1) ;
      
        date.setUTCDate(Number(datepart[0].trim().replace('"'))) ;
       
     date.setUTCHours(Number(timepart[0].trim())) ;
       
        date.setUTCMinutes(Number(timepart[1].trim().replace('"'))) ;
            date.setUTCSeconds(0) ;

      date.setUTCMilliseconds(0) ;
     
     console.log(" Date", date)
  return date.toISOString();

}



function formatToDate(datevalue) {

    console.log("Input", datevalue.length);
    datevalue = datevalue.replace(/^"|"$/g, '') ;
    if(datevalue === undefined || datevalue.trim().length <  4) {

        let currentDate = new Date() ;
        currentDate.setUTCDate(currentDate.getUTCDate() + 100)
        datevalue = currentDate.getUTCDate() + "/" +  (currentDate.getUTCMonth()  + 1 ) + '/' + currentDate.getUTCFullYear() + " 00:00"
    }

    console.log(" == datevalue===", datevalue)
    let splitarry= datevalue.split(' ') ;
    let datepart  = splitarry[0].split("/") ;
    let timepart  = splitarry[1].split(":")
    console.log(timepart)


   

    let date = new Date() ;
      
        date.setUTCFullYear(Number(datepart[2].trim())) ;
        date.setUTCMonth(Number(datepart[1].trim()) - 1) ;
        date.setUTCDate(Number(datepart[0].trim())) ;
        date.setUTCHours(Number(timepart[0].trim())) ;
        date.setUTCMinutes(Number(timepart[1].trim())) ;
        date.setUTCSeconds(0) ;
        date.setUTCMilliseconds(0) ;
console.log(date)
     
  return date.toISOString() ;

}

//readFlightDurationsCsv()
//readCallSignCsv();
//readAirportsCsv();
//readAirlineCsv();

//formatDate("03/12/2017 00:00")
