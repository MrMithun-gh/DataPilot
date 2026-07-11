# Data Model

## CrmRecord Type Definition

```ts
export type CrmRecord = {
  created_at: string;
  name: string;
  email: string;
  country_code: string;
  mobile_without_country_code: string;
  company: string;
  city: string;
  state: string;
  country: string;
  lead_owner: string;
  crm_status: "GOOD_LEAD_FOLLOW_UP" | "DID_NOT_CONNECT" | "BAD_LEAD" | "SALE_DONE" | "";
  crm_note: string;
  data_source: "leads_on_demand" | "meridian_tower" | "eden_park" | "varah_swamy" | "sarjapur_plots" | "";
  possession_time: string;
  description: string;
};
```

## Business Rules

### `crm_status`
- **Allowed values are ONLY:**
  - `GOOD_LEAD_FOLLOW_UP`
  - `DID_NOT_CONNECT`
  - `BAD_LEAD`
  - `SALE_DONE`
- If the source cannot be confidently mapped, output an empty string (`""`).
- Never invent any other value.

### `data_source`
- **Allowed values are ONLY:**
  - `leads_on_demand`
  - `meridian_tower`
  - `eden_park`
  - `varah_swamy`
  - `sarjapur_plots`
- If uncertain, output an empty string (`""`).
- Never invent another value.

### `created_at`
- Must produce a value that satisfies `new Date(value)` in JavaScript.
- If no usable date exists in the source row, output an empty string (`""`).
- Never fabricate a date.

### Multi-email Rule
If a row contains multiple email addresses:
- The first email goes into the `email` field.
- Every remaining email address is appended to `crm_note`.

### Multi-mobile Rule
If a row contains multiple phone numbers:
- The first phone number goes into `mobile_without_country_code`.
- Every remaining phone number is appended into `crm_note`.

### `crm_note` Newline Rule
`crm_note` must never contain literal newline characters.
If source text contains multiple lines (for example Remarks or Notes), replace every newline with the literal two-character sequence:
`\n`
so exported CSV rows always remain single-line.

### Skip Rule
`skip = (email === "") && (mobile_without_country_code === "")`

- This is an AND condition.
- A phone-only record is NOT skipped.
- An email-only record is NOT skipped.
- Only rows with BOTH email and phone missing are skipped.

## Worked Examples

### Example 1
**Scenario:**
- Clean headers
- Clean mapping

**Source Row:**
```csv
Name,Email,Phone,Company
John Doe,john@example.com,5551234,Acme Corp
```

**Expected CrmRecord output:**
```json
{
  "created_at": "",
  "name": "John Doe",
  "email": "john@example.com",
  "country_code": "",
  "mobile_without_country_code": "5551234",
  "company": "Acme Corp",
  "city": "",
  "state": "",
  "country": "",
  "lead_owner": "",
  "crm_status": "",
  "crm_note": "",
  "data_source": "",
  "possession_time": "",
  "description": ""
}
```

### Example 2
**Scenario:**
- Ambiguous headers
- Example headers like: Buyer, Mail ID, Executive, Cell

**Source Row:**
```csv
Buyer,Mail ID,Executive,Cell
Jane Smith,jane@test.com,Bob Sales,9876543210
```

**Expected CrmRecord output:**
```json
{
  "created_at": "",
  "name": "Jane Smith",
  "email": "jane@test.com",
  "country_code": "",
  "mobile_without_country_code": "9876543210",
  "company": "",
  "city": "",
  "state": "",
  "country": "",
  "lead_owner": "Bob Sales",
  "crm_status": "",
  "crm_note": "",
  "data_source": "",
  "possession_time": "",
  "description": ""
}
```

### Example 3
**Scenario:**
- Two phone numbers
- No email
- Second phone stored in crm_note
- Record is NOT skipped

**Source Row:**
```csv
Customer,Mobile 1,Mobile 2
Alice,1112223333,4445556666
```

**Expected CrmRecord output:**
```json
{
  "created_at": "",
  "name": "Alice",
  "email": "",
  "country_code": "",
  "mobile_without_country_code": "1112223333",
  "company": "",
  "city": "",
  "state": "",
  "country": "",
  "lead_owner": "",
  "crm_status": "",
  "crm_note": "Additional phone: 4445556666",
  "data_source": "",
  "possession_time": "",
  "description": ""
}
```
