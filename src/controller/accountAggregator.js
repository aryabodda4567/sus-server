const AccountAggregatorModel = require('../model/accountAggregator');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../../uploads');
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Use timestamp to ensure unique filenames
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

// File filter to only accept JSON files
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/json') {
        cb(null, true);
    } else {
        cb(new Error('Only JSON files are allowed'), false);
    }
};

// Create multer upload instance
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
}).single('file');

const AccountAggregatorController = {
    // Upload account aggregator data
    uploadData: (req, res) => {
        // Use multer to handle file upload
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading
                return res.status(400).json({ error: `Multer error: ${err.message}` });
            } else if (err) {
                // An unknown error occurred
                return res.status(400).json({ error: err.message });
            }
            
            // Check if file was uploaded
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded or file is not a JSON file' });
            }
            
            try {
                // Read the uploaded JSON file
                const filePath = req.file.path;
                const fileData = fs.readFileSync(filePath, 'utf8');
                let jsonData;
                
                try {
                    jsonData = JSON.parse(fileData);
                } catch (parseError) {
                    // Delete the file if it's not valid JSON
                    fs.unlinkSync(filePath);
                    return res.status(400).json({ error: 'Invalid JSON file' });
                }
                
                // Store the data in the database
                const userId = req.user.user_id;
                const result = await AccountAggregatorModel.storeData(userId, jsonData);
                
                // Delete the temporary file
                fs.unlinkSync(filePath);
                
                if (!result.success) {
                    return res.status(500).json({ error: result.error });
                }
                
                return res.status(200).json({
                    message: result.message,
                    id: result.id
                });
            } catch (error) {
                console.error('Error processing account aggregator data:', error);
                // Try to delete the file if it exists
                if (req.file && req.file.path) {
                    try {
                        fs.unlinkSync(req.file.path);
                    } catch (unlinkError) {
                        console.error('Error deleting file:', unlinkError);
                    }
                }
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    },
    
    // Upload account aggregator data as JSON in request body
    uploadJsonData: async (req, res) => {
        try {
            // Check if JSON data was provided
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ error: 'No JSON data provided' });
            }
            
            // Store the data in the database
            const userId = req.user.user_id;
            const result = await AccountAggregatorModel.storeData(userId, req.body);
            
            if (!result.success) {
                return res.status(500).json({ error: result.error });
            }
            
            return res.status(200).json({
                message: result.message,
                id: result.id
            });
        } catch (error) {
            console.error('Error processing account aggregator data:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    
    // Get account aggregator data
    getData: async (req, res) => {
        try {
            const userId = req.user.user_id;
            const result = await AccountAggregatorModel.getData(userId);
            
            if (!result.success) {
                return res.status(404).json({ error: result.error });
            }
            
            return res.status(200).json({
                message: 'Account aggregator data retrieved successfully',
                data: result.data
            });
        } catch (error) {
            console.error('Error retrieving account aggregator data:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    
    // Delete account aggregator data
    deleteData: async (req, res) => {
        try {
            const userId = req.user.user_id;
            const result = await AccountAggregatorModel.deleteData(userId);
            
            if (!result.success) {
                return res.status(404).json({ error: result.error });
            }
            
            return res.status(200).json({
                message: result.message
            });
        } catch (error) {
            console.error('Error deleting account aggregator data:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = AccountAggregatorController;
