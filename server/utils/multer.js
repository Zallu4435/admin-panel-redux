const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    const parentDirectory = path.dirname(__dirname);
    const uploadDir = path.join(parentDirectory, 'uploads');
    
    cb(null, uploadDir); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
});

// Initialize multer with file filter
const upload = multer({ 
  storage: storage, 
  fileFilter: (req, file, cb) => {
    // Only allow certain types of files (e.g., jpeg, png)
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true); 
    } else {
      cb(new Error('Invalid file type, only JPG and PNG are allowed'), false); 
    }
  }
});

module.exports = upload;
