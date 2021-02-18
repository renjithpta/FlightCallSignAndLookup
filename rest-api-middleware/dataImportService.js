const fs   = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname,  '.env') });
const configPathPrefix = path.join(process.cwd(), 'config');
const configPath = path.join(configPathPrefix, 'dataload_config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);
const network = require("./src/fabric/utils.js")
let userName = config.username
if (process.argv[3] && process.argv[3].trim().length > 1) userName = process.argv[2];


async function loadAirlineCsv() {

    const transaction = config.airlinefunction ;
    let csv = fs.readFileSync(config.airlinefilepath);
    var array = csv.toString().split("\n");
    console.log("======Total======", array.length);
    for (let i = 0; i < array.length; i++) {
        console.log("======start==========", i);
        let result = false
        var data = array[i].split(",");
        if (data.length > 1) {
            try {
                data[0] = data[0].trim().replace(/^"|"$/g, '').replace(/"/g, '');
                data[1] = data[1].trim().replace(/^"|"$/g, '').replace(/"/g, '');
                if (data[0].length == 0) data[0] = "";
                if (data[1].length == 0) data[1] = "";
                let networkObj = await network.connectToNetwork(userName)
                result = await network.submitTransction(networkObj, transaction, data[0].toString(), data[1].toString());
            } catch (e) {

            }
            console.log("======Success==========", result, i);
        }
        console.log("\n");

    }

}


async function loadAirportsCsv() {

    const transaction = config.airportfunction;
    let csv = fs.readFileSync(config.airportfilepath);

    var array = csv.toString().split("\n");
    console.log(" ==== Total Records========", array.length)
    for (let i = 0; i < 1; i++) {

        let networkObj = await network.connectToNetwork(userName)
        var data = array[i].split(",");
        if (data.length > 1) {
            try {
                data[0] = data[0].trim().replace(/^"|"$/g, '').replace(/"/g, '');
                data[1] = data[1].trim().replace(/^"|"$/g, '').replace(/"/g, '');
                data[2] = data[2].trim().replace(/^"|"$/g, '').replace(/"/g, '');
                if (data[0].length == 0) data[0] = "";
                if (data[1].length == 0) data[1] = "";
                let result = await network.submitTransction(networkObj, transaction, data[0], data[1], data[2]);
            } catch (e) {
                console.log(e)

            }

            console.log("===Success ===", i, "\n");

        }


    }



}


async function loadFlightDurationsCsv() {

    const transaction = config.durationfunction;
    let csv = fs.readFileSync(config.flightdurationfilepath);

    var array = csv.toString().split("\n");

    for (let i = 0; i < array.length; i++) {
        let networkObj = await network.connectToNetwork(userName);

        var data = array[i].split(",");
        try {
            data[0] = data[0].trim().replace(/^"|"$/g, '').replace(/"/g, '');
            data[1] = data[1].trim().replace(/^"|"$/g, '').replace(/"/g, '');
            data[2] = data[2].trim().replace(/^"|"$/g, '').replace(/"/g, '');
            data[3] = data[3].trim().replace(/^"|"$/g, '').replace(/"/g, '');
            data[4] = data[4].trim().replace(/^"|"$/g, '').replace(/"/g, '');
            if (data[0].length == 0) data[0] = "";
            if (data[1].length == 0) data[1] = "";
            if (data[2].length == 0) data[2] = "";
            if (data[3].length == 0) data[3] = "";
            if (data[4].length == 0) data[4] = "";
            let result = await network.submitTransction(networkObj, transaction, data[0].toString(), data[1].toString(), data[2].toString(), data[3].toString(), data[4].toString());
        } catch (e) {

        }
        console.log("\n");

    }



}



async function loadCallSignCsv() {

    const transaction = config.callsignpath;

    let csv = fs.readFileSync(config.callsignfunction);

    var array = csv.toString().split("\n");
    console.log(" ===========Toal Records ===============", array.length)

    for (let i = 0; i < array.length; i++) {

        let networkObj = await network.connectToNetwork("ibs");

        if (array[i].trim().length > 4) {

            var data = array[i].split(",");

            // console.log(data[0].trim(), data[1].trim(), data[2].trim(), data[3].trim(), data[5].trim(),data[4].trim() , data[6].trim())

            console.log("Format Date", data[4]);
            data[4] = await formatDate(data[4].trim().replace(/^"|"$/g, ''))
            data[6] = formatToDate(data[6].trim().replace(/^"|"$/g, ''))

            try {

                data[0] = data[0].trim().replace(/^"|"$/g, '').replace(/"/g, '');
                data[1] = data[1].trim().replace(/^"|"$/g, '').replace(/"/g, '');
                data[2] = data[2].trim().replace(/^"|"$/g, '').replace(/"/g, '');
                data[3] = data[3].trim().replace(/^"|"$/g, '').replace(/"/g, '');
                data[4] = data[4].trim().replace(/^"|"$/g, '').replace(/"/g, '');
                data[5] = data[5].trim().replace(/^"|"$/g, '').replace(/"/g, '');
                data[6] = data[6].trim().replace(/^"|"$/g, '').replace(/"/g, '')
                if (data[0].length == 0) data[0] = "";
                if (data[1].length == 0) data[1] = "";
                if (data[2].length == 0) data[2] = "";
                if (data[3].length == 0) data[3] = "";
                if (data[4].length == 0) data[4] = "";
                if (data[5].length == 0) data[5] = "";
                if (data[6].length == 0) data[6] = "";

                console.log(data[0].trim(), data[1].trim(), data[2].trim(), data[3].trim(), data[5].trim(), data[4].trim(), data[6].trim())



                let result = await await network.submitTransction(networkObj, transaction, data[0], data[1], data[2], data[3], data[5], data[4], data[6]);

            } catch (e) {
                console.log(e)

            }

            console.log("==== Success ====", i);

        }

    }

}












async function formatDate(datevalue) {


    console.log(" ======Values========");
    datevalue = datevalue.replace(/^"|"$/g, '')

    let splitarry = datevalue.split(' ');

    let datepart = splitarry[0].split("/");

    let timepart = splitarry[1].split(":")



    let date = new Date();

    date.setUTCFullYear(Number(datepart[2].trim().replace('"')));
    date.setUTCMonth(Number(datepart[1].trim()) - 1);

    date.setUTCDate(Number(datepart[0].trim().replace('"')));

    date.setUTCHours(Number(timepart[0].trim()));

    date.setUTCMinutes(Number(timepart[1].trim().replace('"')));
    date.setUTCSeconds(0);

    date.setUTCMilliseconds(0);

    console.log(" Date", date)
    return date.toISOString();

}



function formatToDate(datevalue) {

    console.log("Input", datevalue.length);
    datevalue = datevalue.replace(/^"|"$/g, '');
    if (datevalue === undefined || datevalue.trim().length < 4) {

        let currentDate = new Date();
        currentDate.setUTCDate(currentDate.getUTCDate() + 100)
        datevalue = currentDate.getUTCDate() + "/" + (currentDate.getUTCMonth() + 1) + '/' + currentDate.getUTCFullYear() + " 00:00"
    }

    console.log(" == datevalue===", datevalue)
    let splitarry = datevalue.split(' ');
    let datepart = splitarry[0].split("/");
    let timepart = splitarry[1].split(":")
    console.log(timepart)




    let date = new Date();

    date.setUTCFullYear(Number(datepart[2].trim()));
    date.setUTCMonth(Number(datepart[1].trim()) - 1);
    date.setUTCDate(Number(datepart[0].trim()));
    date.setUTCHours(Number(timepart[0].trim()));
    date.setUTCMinutes(Number(timepart[1].trim()));
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);
    return date.toISOString();

}

async function initDataLoading(){

await loadAirlineCsv();
await loadAirportsCsv();
await loadFlightDurationsCsv()
await loadCallSignCsv();

}

initDataLoading();