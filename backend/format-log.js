const fs = require('fs');
const log = fs.readFileSync('C:\\Users\\sksh-lpuser10\\.gemini\\antigravity-ide\\brain\\6e6f4a1e-cd31-46f2-9776-c4cf407e9fc3\\.system_generated\\tasks\\task-1070.log', 'utf8');
const jsonStr = log.substring(log.indexOf('{"totalRows"'));
const parsed = JSON.parse(jsonStr);
console.log(JSON.stringify(parsed.imported, null, 2));
