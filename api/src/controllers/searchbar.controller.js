import SearchBar from '../models/searchbar.model.js';

const searchPhotos = async (req, res) => {
    const { query } = req.query;

    if (!query || query.trim() === '') {
        return res.status(400).json({ 
            success: false, 
            message: 'Please provide a search keyword.' 
        });
    }

    try {
        const photos = await SearchBar.searchPhotos(query);

        if (photos.length === 0) {
            return res.status(404).json({ 
                success: true, 
                data: [], 
                message: 'No results found for your search.' 
            });
        }

        res.status(200).json({ success: true, data: photos });
    } catch (error) {
        console.error('Error searching photos:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error. Please try again later.' 
        });
    }
};

export { searchPhotos };
