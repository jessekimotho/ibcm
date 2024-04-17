import db from './db';

// Function to import JSON data into the database
async function importDevotion() {
    try {
        const response = await fetch('/devotion.json'); // Fetch JSON data from local file
        if (!response.ok) {
            throw new Error('Failed to fetch JSON data');
        }
        
        const jsonData = await response.json(); // Parse JSON data
       
        // Use a transaction for all DB operations
        await db.transaction('rw', db.daily_entries, async () => {
            for (const entry of jsonData) {
                // Add entry to daily_entries table
                await db.daily_entries.add(entry);
            }
        });

        console.log('Data imported successfully!');
    } catch (error) {
        console.error('Error importing data:', error);
    }
}

// Call the import function
export default importDevotion;
