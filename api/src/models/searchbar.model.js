import db from '../config/db.js'; // Database configuration

class SearchBar {

    static async searchPhotos(query) {
        const searchQuery = `%${query}%`;

        try {
            // Query to search in titles and categories
            const [photos] = await db.query(
                `
                SELECT p.id, p.title, p.description, p.photo_url, p.alt, p.upload_date, p.status, c.name AS category
                FROM photos p
                LEFT JOIN categories c ON p.categories_id = c.id
                WHERE p.title LIKE ? OR c.name LIKE ?
                `,
                [searchQuery, searchQuery]
            );

            return photos;
        } catch (error) {
            console.error('Error searching photos in model:', error);
            throw new Error('Error searching photos');
        }
    }
}

export default SearchBar;
