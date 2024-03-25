/* eslint-disable max-len */
import multer from 'multer';
import { IProductTypeCreate, IProductTypeCreateSchema } from '../interfaces/IProducts';

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const typeInfo = <IProductTypeCreate>req.query;
    IProductTypeCreateSchema.parse(typeInfo);

    cb(null, 'images/product-types');
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