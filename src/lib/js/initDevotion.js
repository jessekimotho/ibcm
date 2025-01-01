import db from './db';

// Function to import JSON data into the database
async function importDevotion() {
    try {
        const response = await fetch('/devotion.json'); // Fetch JSON data from local file
        if (!response.ok) {
            throw new Error('Failed to fetch JSON data');
        }
        const jsonData = await response.json(); // Parse JSON data
        // Use a transaction for inserting into the daily_references and daily_entries table
        await db.transaction('rw', db.daily_references, db.daily_entries, async () => {
            for (const entry of jsonData) {
                // Extract and format day and month
                const { month, day } = extractDate(entry.date);

                // Insert static reference data into daily_references
                const { y1p1, y1p2, y1p3, y1p4, y2p1, y2p2, prayer_passage } = entry;
                await db.daily_references.add({ 
                    day,
                    month,
                    y1p1,
                    y1p2,
                    y1p3,
                    y1p4,
                    y2p1,
                    y2p2,
                    prayer_passage 
                });

            }
        });

        console.log('Data imported successfully!');
    } catch (error) {
        console.error('Error importing data:', error);
    }
}

// Helper function to extract and return day, month, and year from date string (day-month format)
function extractDate(dateString) {
    const [month, day] = dateString.split('-').map(Number);
    return { month, day };
}

// Call the import function
export default importDevotion;
