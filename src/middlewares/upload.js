// Import necessary modules
import multer from "multer";

// Set up storage for image uploads
const imageStorage = multer.diskStorage({
  destination: "uploads/images",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Set up storage for PDF uploads
const pdfStorage = multer.diskStorage({
  destination: "uploads/pdfs",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Filter function for image files
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "File type not supported. Only JPEG and PNG images are allowed."
      ),
      false
    );
  }
};

// Filter function for PDF files
const pdfFileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(
      new Error("File type not supported. Only PDF files are allowed."),
      false
    );
  }
};

// Create the multer instances for image and PDF uploads
const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
});

const uploadPDF = multer({
  storage: pdfStorage,
  fileFilter: pdfFileFilter,
});

// Export the upload middleware instances
export { uploadImage, uploadPDF };
