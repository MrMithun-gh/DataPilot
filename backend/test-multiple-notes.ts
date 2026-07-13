import { extractBatch } from './src/services/aiService';

const testData = [
  { 
    "Name": "John Doe", 
    "Email 1": "primary@example.com", 
    "Email 2": "alt.email@gmail.com",
    "Mobile 1": "+91 9876543210", 
    "Mobile 2": "9998887777",
    "Notes": "Customer requested callback", 
    "Source": "Facebook Leads" 
  }
];

async function run() {
  console.log("Starting extraction...");
  const records = await extractBatch(testData);
  console.log("RAW CRM NOTE:");
  console.log(JSON.stringify(records[0].crm_note));
  console.log("FULL RECORD:");
  console.log(JSON.stringify(records, null, 2));
}

run().catch(console.error);
