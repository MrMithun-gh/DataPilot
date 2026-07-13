import { z } from 'zod';
import { CrmRecord } from '../types/crm';

const CrmStatusEnum = z.enum(["GOOD_LEAD_FOLLOW_UP", "DID_NOT_CONNECT", "BAD_LEAD", "SALE_DONE", ""]);
const DataSourceEnum = z.enum(["leads_on_demand", "meridian_tower", "eden_park", "varah_swamy", "sarjapur_plots", ""]);

export const CrmRecordValidator = z.object({
  created_at: z.string().transform((val) => {
    if (!val) return "";
    const d = new Date(val);
    return isNaN(d.getTime()) ? "" : val;
  }).catch(""),
  name: z.string().catch(""),
  email: z.string().email().or(z.literal("")).catch(""),
  country_code: z.string().catch(""),
  mobile_without_country_code: z.string().transform((val) => {
    const digits = val.replace(/\D/g, '');
    if (digits.length >= 7 && digits.length <= 15) return digits;
    return "";
  }).catch(""),
  company: z.string().catch(""),
  city: z.string().catch(""),
  state: z.string().catch(""),
  country: z.string().catch(""),
  lead_owner: z.string().catch(""),
  crm_status: z.any().transform((val) => {
    const res = CrmStatusEnum.safeParse(val);
    return res.success ? res.data : "";
  }),
  crm_note: z.string().catch(""),
  data_source: z.any().transform((val) => {
    const res = DataSourceEnum.safeParse(val);
    return res.success ? res.data : "";
  }),
  possession_time: z.string().catch(""),
  description: z.string().catch("")
});

export const validateAndFilterRecords = (rawRecords: any[], originalRowsMap: any[]) => {
  const imported: CrmRecord[] = [];
  const skipped: { row: any; reason: string }[] = [];

  for (let i = 0; i < rawRecords.length; i++) {
    const rawRecord = rawRecords[i];
    const originalRow = originalRowsMap[i];

    const parseResult = CrmRecordValidator.safeParse(rawRecord);

    if (!parseResult.success) {
      skipped.push({ row: originalRow, reason: "Data structure radically invalid" });
      continue;
    }

    const record = parseResult.data as CrmRecord;

    // Enforce safety net unconditionally:
    record.crm_note = record.crm_note
      .replace(/(?:\n)?Unidentified Source: [^\n]*/g, '')
      .replace(/^\n/, '');

    // Apply the EXACT skip rule
    const skip = (record.email === "") && (record.mobile_without_country_code === "");

    if (skip) {
      skipped.push({ row: originalRow, reason: "Missing both email and phone number" });
    } else {
      imported.push(record);
    }
  }

  return { imported, skipped };
};
