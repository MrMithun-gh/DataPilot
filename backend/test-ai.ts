import { extractBatch } from './src/services/aiService';

const examples = [
  // Example 1
  {
    "Name": "John Doe",
    "Email": "john@example.com",
    "Phone": "5551234",
    "Company": "Acme Corp"
  },
  // Example 2
  {
    "Buyer": "Jane Smith",
    "Mail ID": "jane@test.com",
    "Executive": "Bob Sales",
    "Cell": "9876543210"
  },
  // Example 3
  {
    "Customer": "Alice",
    "Mobile 1": "1112223333",
    "Mobile 2": "4445556666"
  }
];

async function run() {
  try {
    console.log("Calling OpenAI...");
    const results = await extractBatch(examples);
    console.log("SUCCESS! Expected output array of 3 CrmRecords. Actual:");
    console.log(JSON.stringify(results, null, 2));
  } catch (error: any) {
    console.error("FAILED TO VERIFY:");
    console.error(error.message);
  }
}

run();
