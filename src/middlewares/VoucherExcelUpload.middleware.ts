import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    cb(null, `uploads/${req.query.id}_${req.query.name}`);
  },
  filename: (req, file, cb) => {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${req.query.id}_${req.query.name}_${Number(new Date())}.${fileExtension}`;

    cb(null, fileName);
  },
});

const upload = multer({ storage });
const VoucherExcelUploadMiddleware = upload.single('file');

export default VoucherExcelUploadMiddleware;