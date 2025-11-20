const fs = require('fs');
const { toJSON } = require('bibtex-parse-js');

try {
    const bibtex = fs.readFileSync('public/publications.bib', 'utf8');
    try {
        const parsed = toJSON(bibtex);
        console.log(`Successfully parsed ${parsed.length} entries.`);
        if (parsed.length > 0) {
            console.log("First entry structure:", JSON.stringify(parsed[0], null, 2));
        }
        
        const invalidEntries = parsed.filter(p => !p.entryTags);
        if (invalidEntries.length > 0) {
            console.error(`Found ${invalidEntries.length} entries without entryTags!`);
            console.log(JSON.stringify(invalidEntries[0], null, 2));
        } else {
            console.log("All entries have entryTags.");
        }
    } catch (e) {
        console.error("Parsing Error:");
        console.error(e);
    }
} catch (e) {
    console.error("File Error:", e.message);
}
