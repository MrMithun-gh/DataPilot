import { extractBatch } from './src/services/aiService';

const testData = [
  { "Name": "Rahul", "Email 1": "rahul@example.com", "Mobile 1": "+91 9876543210", "Notes": "Very interested in the plot", "Source": "Facebook Leads" }
];

async function run() {
  console.log("Starting extraction...");
  const records = await extractBatch(testData);
  console.log(JSON.stringify(records, null, 2));
}

run().catch(console.error);
