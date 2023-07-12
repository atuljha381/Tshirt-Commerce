const router = require("express").Router();
const product = require("./../controller/product.controller");
const multer = require("multer");

const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ dest: "uploads/" });

router.post("/", product.createProduct);
router.get("/", product.getAllProducts);
router.get("/:id", product.getProductById);
router.patch("/:id", product.updateProductById);
router.delete("/:id", product.deleteProductById);
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    console.log("no file recieved");
    return res.send(401).json({
      status: "fail",
    });
  } else {
    console.log("file recieved");
    return res.send(201).json({
      status: "success",
    });
  }
});

module.exports = router;
