// requires and imports
import fetch from 'node-fetch';
import { openStdin } from 'process';
require("dotenv").config();
var readline = require('readline');

// globals
const API_KEY = process.env.API_KEY;
var rl = readline.createInterface(process.stdin, process.stdout);

// functions
async function listPrivateEngines(): Promise<void> {
    const response = await fetch('https://api.sepana.io/v1/engine/user/list', {
        headers: {
            'x-api-key': API_KEY
        }
    });
    const body = await response.json();
    console.log(body);
}

async function listPublicEngines(): Promise<void> {
    const response = await fetch('https://api.sepana.io/v1/engine/public/list', {
        headers: {
            'x-api-key': ''
        }
    })
    const body = await response.json();
    console.log(body);
}

async function insertData() {
    console.log(`
    Inserting data to <engineId> with format:
      {
        'id': ,
        'name' ,
        'age' 
      }`);
    let engineId = await askQuestion("Enter Engine Id: ");
    let id = await askQuestion("Enter id: ");
    let name = await askQuestion("Enter name: ");
    let age = await askQuestion("Enter age: ");

    const response = await fetch('https://api.sepana.io/v1/engine/insert_data', {
        method: 'POST',
        headers: {
            'x-api-key': API_KEY,
            'Content-Type': 'application/json'
        },
        
        body: JSON.stringify({
            'engine_id': engineId,
            'docs': [
                {
                    '_id': 1,
                    'name': "owo",
                    'age': 24
                }
            ]
        })
    });

    const body = await response.json();

    console.log("Insert Data Job Queued: ")
    console.log(body);
}

async function viewJobStatus() {
    let jobId = await askQuestion("Enter job id: ");
    let url = 'https://api.sepana.io/v1/job/status/' + jobId;
    const response = await fetch(url, {
        headers: {
            'x-api-key': API_KEY
        }
    })
    const body = await response.json();
    console.log(body);
}

async function deleteDataById() {
  let engineId = await askQuestion("Enter Engine Id: ");
  let id = await askQuestion("Enter _id: ");

  const response = await fetch('https://api.sepana.io/v1/engine/data/delete', {
      method: 'DELETE',
      headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json'
      },
      
      body: JSON.stringify({
          'engine_id': engineId,
          'delete_query': {
              'query': {
                  'match': {
                      'name': id
                  }
              }
          }
      })
  });

  console.log(await response.json());
}

async function search() {
  let engineId = await askQuestion("Enter Engine Id: ");
  let name = await askQuestion("Enter name: ");
  
  const response = await fetch('https://api.sepana.io/v1/search', {
      method: 'POST',
      headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          'engine_ids': [
              engineId
          ],
          'query': {
              'query_string': {
                  'name': name
              }
          },
          'size': 1,
          'page': 0
      })
  });

  console.log(await response.json());
}


function askQuestion(query:string): Promise<string> {
    return new Promise(resolve => rl.question(query, ans => {
        resolve(ans);
    }))
}

// main loop
async function main(): Promise<void> {
    let option: number;

    console.log(`
    ~~ Welcome to Sepana Tool - Made by ori ~~
    1. List Private Engines
    2. List Public Engines
    3. Insert Data
    4. View Job Status
    5. Delete Data
    6. Search
    0. Quit
    `)

    while (option != 0) {
        option = Number(await askQuestion("Enter number: "));
        switch (option) {
            case 1:
                await listPrivateEngines();
                break;
            case 2:
                await listPublicEngines();
                break;
            case 3:
                await insertData();
                break;
            case 4:
                await viewJobStatus();
                break;
            case 5:
                await deleteDataById();
                break;
            case 6:
                await search();
                break;
            default:
        }
    }
    rl.close();
}

main();