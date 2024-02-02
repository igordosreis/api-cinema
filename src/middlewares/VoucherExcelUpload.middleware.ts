/* eslint-disable max-len */
import multer from 'multer';

const storage = multer.memoryStorage();
// const storage = multer.diskStorage({
//   destination: (req, _file, cb) => {
//     cb(null, `uploads/${req.query.establishmentId}_${req.query.establishmentName}`);
//   },
//   filename: (req, file, cb) => {
//     const fileExtension = file.originalname.split('.').pop();
//     const fileName = `${req.query.establishmentId}_${req.query.establishmentName}_${Number(new Date())}.${fileExtension}`;

//     cb(null, fileName);
//   },
// });

const upload = multer({ storage });
const VoucherExcelUploadMiddleware = upload.single('file');

export default VoucherExcelUploadMiddleware;