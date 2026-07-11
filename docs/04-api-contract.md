# API Contract

## 1. Endpoint
**POST** `/api/import`

- **Content-Type:** `multipart/form-data`
- **Uploaded file field name:** `file`

## 2. Request Validation
- **File Type:** Accept `.csv` files only. Reject all other file types with HTTP 400.
- **File Size:** Maximum file size is 5 MB. Reject oversized uploads with HTTP 400.

## 3. Successful (200) Response Shape

```ts
{
  totalRows: number,
  importedCount: number,
  skippedCount: number,
  imported: CrmRecord[],
  skipped: [
    {
      row: Record<string, any>, // original raw row object
      reason: string
    }
  ]
}
```

### Field Explanations
- `totalRows`: Total number of data rows parsed from the CSV.
- `importedCount`: Total number of records successfully extracted and that passed the validation/skip rules.
- `skippedCount`: Total number of records skipped.
- `imported`: An array of validated `CrmRecord` objects containing the AI-mapped data.
- `skipped`: An array containing details of every row that was not imported.
  - `row`: The original, raw row object exactly as parsed from the CSV, preserving its original messy headers.
  - `reason`: A human-readable string explaining why the row was skipped (e.g., "Missing both email and phone number", or "AI extraction failed for this batch").

## 4. Error Responses

### HTTP 400 Bad Request
```json
{
  "error": "string"
}
```
**Used for:**
- Invalid file type
- File larger than 5 MB
- Empty CSV
- Unparseable CSV

### HTTP 502 Bad Gateway
```json
{
  "error": "string"
}
```
**Used when:**
- The AI provider remains unreachable after all retry attempts have been exhausted.

## 5. Frontend Requirements Cross-Check

The 200 response contract already contains all information required by the frontend to render the final result screen:

- **Statistics cards (Total rows, Imported rows, Skipped rows):** Directly mapped to `totalRows`, `importedCount`, and `skippedCount`.
- **Imported records table:** Directly mapped to the `imported` array of `CrmRecord` objects.
- **Skipped records table:** Driven by the `skipped` array, containing the original `row` data.
- **Skip reason for every skipped record:** Provided by the `reason` field on each item in the `skipped` array.

Because all necessary UI data is calculated and bundled by the backend, the frontend remains completely stateless and merely renders the response.
