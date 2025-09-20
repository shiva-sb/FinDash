
import express from "express";
import multer from "multer";

import { uploadFile, extractTableFromPdf } from "../controllers/fileController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();


const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });


router.post("/upload", verifyToken, upload.single("file"), uploadFile);



router.post("/extract-pdf", verifyToken, upload.single("pdfFile"), extractTableFromPdf);

export default router;