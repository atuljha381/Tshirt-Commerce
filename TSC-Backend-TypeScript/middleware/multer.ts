import multer from "multer";
import path from "path";
import logger from "./logger";

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb) => {
    cb(null, "uploads/");
  },
  filename: (req: any, file: any, cb: any) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

const upload = multer({ storage: storage });
export default upload;
