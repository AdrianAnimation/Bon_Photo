// Simple protective middleware for content validation
export const contentGuard = (req, res, next) => {
    const text = req.body.text || req.body.description || req.body.title;
    
    // Text content validation
    if (text) {
        // Check for excessive repetition (e.g., "aaaaa", "!!!!!!")
        if (/(.)\\1{4,}/.test(text)) {
            return res.status(400).json({ 
                error: 'Please avoid excessive character repetition' 
            });
        }
        
        // Check length (adjust max length as needed)
        if (text.length > 1000) {
            return res.status(400).json({ 
                error: 'Text is too long. Maximum 1000 characters allowed.' 
            });
        }

        // Check for empty or whitespace-only content
        if (text.trim().length === 0) {
            return res.status(400).json({ 
                error: 'Content cannot be empty' 
            });
        }
    }

    // File validation (for photo uploads)
    if (req.file) {
        // Check file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (req.file.size > maxSize) {
            return res.status(400).json({ 
                error: 'File too large. Maximum size is 5MB' 
            });
        }

        // Verify image type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ 
                error: 'Invalid file type. Allowed types: JPEG, PNG, GIF, WEBP' 
            });
        }

        // Basic image name sanitization
        const fileName = req.file.originalname.toLowerCase();
        if (!/^[a-zA-Z0-9-_\s.]+$/.test(fileName)) {
            return res.status(400).json({ 
                error: 'Invalid file name. Use only letters, numbers, and simple punctuation' 
            });
        }
    }

    next();
};
