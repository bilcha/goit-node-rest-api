import multer from "multer";
import path from "path";
import HttpError from "../helpers/HttpError";

const destination = path.resolve("tmp");
const storage = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fieldname = `${uniquePrefix}-${file.originalname}`;
    cb(null, fieldname);
  },
});

const fileFilter = (req, file, cb) => {
  const extension = file.originalname.split(".").pop();
  if (extension === "exe") {
    return cb(HttpError(400, ".exe extention not allowed"));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;
