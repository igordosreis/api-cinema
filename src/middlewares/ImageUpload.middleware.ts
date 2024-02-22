/* eslint-disable max-len */
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    cb(null, `images/establishments/${req.query.imageType}`);
  },
  filename: (req, file, cb) => {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${req.query.establishmentId}_${req.query.imageType}_${Number(new Date())}.${fileExtension}`;

    req.body.name = fileName;
    
    cb(null, fileName);
  },
});

const upload = multer({ storage });
const ImageUploadMiddleware = upload.single('file');

export default ImageUploadMiddleware;