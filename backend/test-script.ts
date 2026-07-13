import { extractBatch } from './src/services/aiService';

async function test() {
  try {
    const res = await extractBatch([{ name: "Test" }]);
    console.log("SUCCESS:", res);
  } catch (error: any) {
    console.error("OpenAI batch call failed — status:", error?.status, "message:", error?.message || error, "full error:", JSON.stringify(error?.response?.data || error, null, 2));
  }
}
test();
