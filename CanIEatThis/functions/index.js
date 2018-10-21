
'use strict';

const http = require('http');
const functions = require('firebase-functions');

const host = 'api.nal.usda.gov';
const apiKey = 'DEMO_KEY';

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((req, res) => {

  let allergy = req.body.queryResult.parameters['Allergy'];
  allergy = allergy.toLowerCase().trim().replace('?', '');
  let food = req.body.queryResult.parameters['Food'];
  food = food.toLowerCase().trim().replace('?', '');

  // Call the food API
  callFoodApi(food, allergy).then((output) => {
    res.json({ 'fulfillmentText': output }); // Return the results of the weather API to Dialogflow
  }).catch(() => {
    res.json({ 'fulfillmentText': `Something went wrong with the API call.` });
  });
});

function callFoodHelperApi (food) {
  return new Promise((resolve, reject) => {
    // Create the path for the HTTP request to get the food information
    let path = '/ndb/search/?format=json&q=' +
      food.replace(' ', '_') + '&sort=n&max=25&offset=0&api_key=' + apiKey;
    console.log('API Request: ' + host + path);

    // Make the HTTP request to get the food info
    http.get({host: host, path: path}, (res) => {
      let body = ''; // var to store the response chunks
      res.on('data', (d) => { body += d; }); // store each response chunk
      res.on('end', () => {
        // After all the data has been received parse the JSON for desired data
        let response = JSON.parse(body);
        console.log(response);
        console.log(response.list.item[0].ndbno);
        let ndbno = response.list.item[0].ndbno;

        // Resolve the promise with the database number for individual look up
        resolve(ndbno);
      });
      res.on('error', (error) => {
        console.log(`Error calling the API: ${error}`);
        reject();
      });
    });
  });
}

function callFoodApi (food, allergy){
    return new Promise((resolve, reject) => {
        callFoodHelperApi(food).then((output) => {
            // Create the path for the HTTP request to get the food list info
            let path = '/ndb/V2/reports?ndbno=' +
            output + '&type=f&format=json&api_key=' + apiKey;
            console.log('API Request: ' + host + path);

            // Make the HTTP request to get the food list info
            http.get({host: host, path: path}, (res) => {
                let body = ''; // var to store the response chunks
                res.on('data', (d) => { body += d; }); // store each response chunk
                res.on('end', () => {
                    // After all the data has been received parse the JSON for desired data
                    let response = JSON.parse(body);
                    console.log(response);
                    console.log(response.foods[0]);
                    console.log(response.foods[0].food);
                    
                    // Handle empty food results
                    if(response.hasOwnProperty('errors')){
                        resolve('That food didn\'t have any results in our search.');
                    }
                    if(!response.foods[0].food.ing.hasOwnProperty('desc')){
                        resolve('That food didn\'t have any ingredients in our search to compare.');
                    }
                    let ing = response.foods[0].food.ing.desc;
                    ing = ing.toLowerCase();
                    console.log(ing);
                    
                    // Handle different allergies
                    if(allergy === 'tree nuts'){
                        if(ing.indexOf('hazelnut') !== -1){
                            resolve('tree nuts' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('almond') !== -1){
                            resolve('tree nuts' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('walnut') !== -1){
                            resolve('tree nuts' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('pine nut') !== -1){
                            resolve('tree nuts' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('pecans') !== -1){
                            resolve('tree nuts' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('brazil nut') !== -1){
                            resolve('tree nuts' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('cashew') !== -1){
                            resolve('tree nuts' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('chestnut') !== -1){
                            resolve('tree nuts' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('macadamia') !== -1){
                            resolve('tree nuts' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('pistachio') !== -1){
                            resolve('tree nuts' + ' exists in ' + food + '.');
                        }
                    }else if(allergy === 'dairy'){
                        if(ing.indexOf('milk') !== -1){
                            resolve('dairy' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('cream') !== -1){
                            resolve('dairy' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('buttermilk') !== -1){
                            resolve('dairy' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('half and half') !== -1){
                            resolve('dairy' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('butter') !== -1){
                            resolve('dairy' + ' exists in ' + food + '.');
                        }
                    }else if(allergy === 'fish'){
                        if(ing.indexOf('pollock') !== -1){
                            resolve('fish' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('carp') !== -1){
                            resolve('fish' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('cod') !== -1){
                            resolve('fish' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('dogfish') !== -1){
                            resolve('fish' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('mackerel') !== -1){
                            resolve('fish' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('salmon') !== -1){
                            resolve('fish' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('sole') !== -1){
                            resolve('fish' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('tuna') !== -1){
                            resolve('fish' + ' exists in ' + food + '.');
                        }
                        
                    }else if(allergy === 'shellfish'){
                        if(ing.indexOf('crustacean') !== -1){
                            resolve('shellfish' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('shrimp') !== -1){
                            resolve('shellfish' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('prawn') !== -1){
                            resolve('shellfish' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('crab') !== -1){
                            resolve('shellfish' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('lobster') !== -1){
                            resolve('shellfish' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('black tiger') !== -1){
                            resolve('shellfish' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('greasyback') !== -1){
                            resolve('shellfish' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('neptune rose') !== -1){
                            resolve('shellfish' + ' exists in ' + food + '.');
                        }
                    }else if(allergy === 'soy'){
                        if(ing.indexOf('soy') !== -1){
                            resolve('soy' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('chickpea') !== -1){
                            resolve('soy' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('lentil') !== -1){
                            resolve('soy' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('lupin') !== -1){
                            resolve('soy' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('pea') !== -1){
                            resolve('soy' + ' exists in ' + food + '.');
                        }
                    }else if(allergy === 'gluten'){
                        if(ing.indexOf('gluten') !== -1){
                            resolve('gluten' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('wheat') !== -1){
                            resolve('gluten' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('rye') !== -1){
                            resolve('gluten' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('barley') !== -1){
                            resolve('gluten' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('flour') !== -1){
                            resolve('gluten' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('triticale') !== -1){
                            resolve('gluten' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('oats') !== -1){
                            resolve('gluten' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('brewers yeast') !== -1){
                            resolve('gluten' + ' exists in ' + food + '.');
                        }else if(ing.indexOf('malt') !== -1){
                            resolve('gluten' + ' exists in ' + food + '.');
                        }
                    }
                    
                    // Handle allergy that exists that's not listed up above
                    if(ing.indexOf(allergy) !== -1){
                        resolve(allergy + ' exists in ' + food + '.');
                    }else{
                        resolve('It appears from the ingredient list that there isn\'t any ' + allergy + ' in ' + food + '.');
                    }
                    
                });
                res.on('error', (error) => {
                    console.log(`Error calling the API: ${error}`);
                    resolve('Error');
                });
            });
        });
    });
}
