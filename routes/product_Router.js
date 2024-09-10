const express = require("express");
const {
  addProduct,
  getProduct,
  getCategoryProducts,
  getAllProducts,
  searchProducts,
  updateProduct,
} = require("../controller/product");
const {
  uploadFile,
  upload,
  uploadFileNew,
  rollBackUploads,
} = require("../controller/upload-files");
const { createReview } = require("../controller/review");
// const {  uploadFile, upload } = require("../controller/upload-files");
const router = express.Router();

// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
// const multer = require('multer');
// const multerS3 = require('multer-s3');
// const bucket = process.env.AWS_BUCKET_NAME;

// const client = new S3Client({
//     credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY,
//         secretAccessKey: process.env.AWS_SECRET_KEY
//     },
//     region: process.env.BUCKET_REGION
// });

// const upload = multer({
//     storage: multerS3({

//         acl : 'public-read',
//         s3: client,
//         bucket: bucket,
//         metadata: function (req, file, cb) {
//             cb(null, { fieldName: file.fieldname });
//             console.log("file.fieldname : " + file.fieldname);
//         },

//         key: function (req, file, cb) {
//             cb(null, file.originalname);
//         },

//     }),
//     fileFilter : function (req, file, cb) {
//         // Check if the file's MIME type is image/jpeg or image/png
//         if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//             // Allow the upload
//             cb(null, true);
//         } else {
//             // Reject the upload with an error message
//             cb(new Error('Only JPEG and PNG images are allowed'));
//         }
//     }
// });

// router.post("/addProduct",  upload.array('images', 5) , addProduct);
router.post("/addProduct", addProduct);
router.post("/updateProduct", updateProduct);
router.get("/Product", getProduct);
router.get("/test", (req, res) => {
  console.log("holaa!");
  res.status(200).json({message : "It's working" })
});

router.get("/category-products/:categoryId", getCategoryProducts);
router.get("/search-product", searchProducts);
router.get("/all-products", getAllProducts);


router.post("/rate-product", createReview);
// router.put("/check",  upload.array('images', 5)
// , async (req, res) => {
//         const url = [];
//         req.files.forEach((file) => {
//                 url.push(file);
//               });

//             // console.log(url);
//             res.send({url : url});
//         }
//     );

router.get("/getUrl", uploadFileNew);
router.post("/rollBackUploads", rollBackUploads);

module.exports = router;
