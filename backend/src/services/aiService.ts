import OpenAI from 'openai';
import dotenv from 'dotenv';
import { CrmRecord } from '../types/crm';
import { EXTRACTION_SYSTEM_PROMPT } from '../prompts/extractionPrompt';

dotenv.config();

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const MODEL = 'gpt-4o-mini';

export const CrmRecordSchema = {
  type: "json_schema",
  json_schema: {
    name: "crm_record_extraction",
    strict: true,
    schema: {
      type: "object",
      properties: {
        created_at: { type: "string" },
        name: { type: "string" },
        email: { type: "string" },
        country_code: { type: "string" },
        mobile_without_country_code: { type: "string" },
        company: { type: "string" },
        city: { type: "string" },
        state: { type: "string" },
        country: { type: "string" },
        lead_owner: { type: "string" },
        crm_status: {
          type: "string",
          enum: ["GOOD_LEAD_FOLLOW_UP", "DID_NOT_CONNECT", "BAD_LEAD", "SALE_DONE", ""]
        },
        crm_note: { type: "string" },
        data_source: {
          type: "string",
          enum: ["leads_on_demand", "meridian_tower", "eden_park", "varah_swamy", "sarjapur_plots", ""]
        },
        possession_time: { type: "string" },
        description: { type: "string" }
      },
      required: [
        "created_at",
        "name",
        "email",
        "country_code",
        "mobile_without_country_code",
        "company",
        "city",
        "state",
        "country",
        "lead_owner",
        "crm_status",
        "crm_note",
        "data_source",
        "possession_time",
        "description"
      ],
      additionalProperties: false
    }
  }
} as const;

export const extractBatch = async (rows: any[]): Promise<CrmRecord[]> => {
  if (rows.length === 0) return [];

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: EXTRACTION_SYSTEM_PROMPT },
      { role: "user", content: JSON.stringify(rows) }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "crm_record_batch",
        strict: true,
        schema: {
          type: "object",
          properties: {
            records: {
              type: "array",
              items: CrmRecordSchema.json_schema.schema
            }
          },
          required: ["records"],
          additionalProperties: false
        }
      }
    },
    temperature: 0,
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("No content returned from OpenAI");
  }

  const parsed = JSON.parse(content);
  return parsed.records as CrmRecord[];
};

export type BatchResult = {
  success: boolean;
  records?: CrmRecord[];
  error?: string;
  originalRows: any[];
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const extractBatchWithRetry = async (batch: any[], retries = 2): Promise<CrmRecord[]> => {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      return await extractBatch(batch);
    } catch (error: any) {
      if (attempt === retries) {
        throw error;
      }
      // Exponential backoff: 2^attempt * 1000 ms (1s, 2s)
      const delay = Math.pow(2, attempt) * 1000;
      await sleep(delay);
      attempt++;
    }
  }
  throw new Error("AI extraction failed for this batch");
};

export const processCsvImport = async (rows: any[]): Promise<BatchResult[]> => {
  const BATCH_SIZE = 50;
  const CONCURRENCY_LIMIT = 5;
  const batches: any[][] = [];

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    batches.push(rows.slice(i, i + BATCH_SIZE));
  }

  const allResults: BatchResult[] = [];

  for (let i = 0; i < batches.length; i += CONCURRENCY_LIMIT) {
    const batchGroup = batches.slice(i, i + CONCURRENCY_LIMIT);
    
    const promises = batchGroup.map(async (batch) => {
      try {
        const records = await extractBatchWithRetry(batch, 2);
        return { success: true, records, originalRows: batch } as BatchResult;
      } catch (error: any) {
        return { 
          success: false, 
          error: "AI extraction failed for this batch", 
          originalRows: batch 
        } as BatchResult;
      }
    });

    const settled = await Promise.allSettled(promises);
    
    settled.forEach((result) => {
      if (result.status === 'fulfilled') {
        allResults.push(result.value);
      } else {
        // Fallback for unhandled promise rejections inside the map
        allResults.push({
          success: false,
          error: "AI extraction failed for this batch",
          originalRows: []
        });
      }
    });
  }

  return allResults;
};
