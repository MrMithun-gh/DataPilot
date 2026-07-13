/**
 * Maps an unambiguous calling code (with or without '+') to a country name.
 * Ambiguous codes (like +1, +7) are purposely left unmapped.
 */

const unambiguousCountryCodes: Record<string, string> = {
  "91": "India",
  "44": "United Kingdom",
  "61": "Australia",
  "971": "United Arab Emirates",
  "86": "China",
  "49": "Germany",
  "33": "France",
  "81": "Japan",
  "55": "Brazil",
  "65": "Singapore",
  "27": "South Africa",
  "64": "New Zealand",
  "34": "Spain",
  "39": "Italy",
  "52": "Mexico",
  "82": "South Korea",
  "63": "Philippines",
  "62": "Indonesia"
};

export function inferCountryFromCode(code: string): string | null {
  if (!code) return null;
  // Remove any '+' prefix or whitespace
  const cleanCode = code.replace(/^\+/, '').trim();
  
  return unambiguousCountryCodes[cleanCode] || null;
}
