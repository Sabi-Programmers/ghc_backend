// Import necessary modules
import multer from 'multer';
import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Function to replace spaces with hyphens in the file name
const replaceSpacesWithHyphens = (filename) => {
    return filename.replace(/\s+/g, '-');
};

// Set up storage for image uploads
const imageStorage = multer.diskStorage({
    destination: 'uploads/images',
    filename: (req, file, cb) => {
        const sanitizedFilename = replaceSpacesWithHyphens(file.originalname);
        cb(null, Date.now() + '-' + sanitizedFilename);
    },
});

// Set up storage for PDF uploads
const pdfStorage = multer.diskStorage({
    destination: 'uploads/pdfs',
    filename: (req, file, cb) => {
        const sanitizedFilename = replaceSpacesWithHyphens(file.originalname);
        cb(null, Date.now() + '-' + sanitizedFilename);
    },
});

// Filter function for image files
const imageFileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                'File type not supported. Only JPEG and PNG images are allowed.',
            ),
            false,
        );
    }
};

// Filter function for PDF files
const pdfFileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(
            new Error('File type not supported. Only PDF files are allowed.'),
            false,
        );
    }
};

// Create the multer instances for image and PDF uploads with size limits
const uploadImage = multer({
    storage: imageStorage,
    fileFilter: imageFileFilter,
    limits: { fileSize: Number(process.env.IMAGE_LIMIT) * 1024 * 1024 },
});

const uploadPDF = multer({
    storage: pdfStorage,
    fileFilter: pdfFileFilter,
    limits: { fileSize: Number(process.env.PDF_LIMIT) * 1024 * 1024 },
});

// Function to delete files
const deleteFile = (fileName) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const filePath = join(__dirname, '..', '..', 'uploads/images', fileName);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Error deleting file: ${filePath}`, err);
        }
    });
};

// Export the upload middleware instances and deleteFile function
export { uploadImage, uploadPDF, deleteFile };
