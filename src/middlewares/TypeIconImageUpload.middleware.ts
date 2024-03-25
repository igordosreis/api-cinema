/* eslint-disable max-len */
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    cb(null, `images/product-types/${req.query.name}`);
  },
  filename: (req, file, cb) => {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${req.query.name}.${fileExtension}`;

    req.body.name = fileName;
    
    cb(null, fileName);
  },
});

const upload = multer({ storage });
const TypeIconImageUploadMiddleware = upload.single('file');

export default TypeIconImageUploadMiddleware;