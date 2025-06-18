import multer from 'multer';


// הגדרת אחסון הקבצים עם שמות ייחודיים ושמירה על השם המקורי
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // תיקיית יעד
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const safeOriginalName = file.originalname.replace(/\s+/g, '_'); 
    cb(null, `${uniqueSuffix}-${safeOriginalName}`);
  }
});


export const upload = multer({ storage });