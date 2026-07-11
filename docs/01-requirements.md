# Requirements

## The Core Problem
Users upload CSVs with arbitrary and inconsistent column headers from various sources (such as Facebook Lead Export, Google Ads Export, manual spreadsheets, and real estate CRM exports). The system must use an LLM to intelligently map these inconsistent formats into one fixed CRM schema.

## 4-Stage User Flow
1. **Upload:** User uploads a CSV file.
2. **Preview:** The CSV is previewed entirely client-side (no AI processing happens here).
3. **Confirm Import:** The user confirms the import. Only at this point does the AI and backend get involved for processing.
4. **Result:** The system displays the final results, showing both imported and skipped records.

## Target CRM Fields
The output must map to these 15 exact fields:
- `created_at`
- `name`
- `email`
- `country_code`
- `mobile_without_country_code`
- `company`
- `city`
- `state`
- `country`
- `lead_owner`
- `crm_status`
- `crm_note`
- `data_source`
- `possession_time`
- `description`

## Explicit Non-Goals
The following features are explicitly out of scope for this project:
- No authentication
- No database (the backend is entirely stateless — it processes the file and returns a response, without persisting any data)
- No user management
- No Redux
- No login flow
