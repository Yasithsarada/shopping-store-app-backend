// const { S3Client , PutObjectCommand} = require('@aws-sdk/client-s3')
// const multer = require("multer");
// const multerS3 = require("multer-s3");
// const bucket = process.env.AWS_BUCKET_NAME;

// const client = new S3Client({  // client = s3
//     credentials : {
//         accessKeyId : process.env.AWS_ACCESS_KEY, 
//         secretAccessKey : process.env.AWS_SECRET_KEY
//     },
//     region : process.env.BUCKET_REGION
// });

//     const upload = multer({
//         storage: multerS3({
//           s3: client,
//           bucket: bucket,
//           metadata: function (req, file, cb) {
//             cb(null, {fieldName: file.fieldname});
//           },
//           key: function (req, file, cb) {
//             cb(null, Date.now().toString() )
//           }
//         })
//       })

// const uploadFile = async (req, res) => {

//   try {
//       if (!req.files || req.files.length === 0) {
//           return res.status(400).send({ message: 'No files uploaded.' });
//       }
//     //   console.log("req.files.originalname :" +req.files.originalname)
//       console.log("req.files :" +req.files)
//       console.log( "Buffr :" +req.files.buffer)
  
//     //   const file = req.files[0]; // Assuming only one file is uploaded
        
//     //   const input = {
//     //       Bucket: bucket,
//     //       Body: file.buffer, // Use file.buffer instead of req.files.buffer
//     //       Key: file.originalname // Use file.originalname instead of req.files.originalname
//     //   };
      
//     //   req.file.buffer
//       const input = {
//         // ACL: "public-read" ,
//           Bucket: bucket,
//           Body: req.files.buffer,
//           Key: req.files.originalname
//       }
//       const command = new PutObjectCommand(input);
  
//       const response = await client.send(command);
  
//   // console.log(process.env.AWS_ACCESS_KEY)
//   res.send({response: response})
//   } catch (error) {
//     res.status(400).json({ message: error.message});
//   }
// }

// module.exports =  {
//     upload, uploadFile
// }



const { S3Client, PutObjectCommand , PutObjectCommandInput, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const bucket = process.env.AWS_BUCKET_NAME;
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
// import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require("crypto");

const client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    },
    region: process.env.BUCKET_REGION
});

const upload = multer({
    storage: multerS3({
        acl : 'public-read',
        s3: client,
        bucket: bucket,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname});
            console.log("file.fieldname : " + file.fieldname);
        },
    
        key: function (req, file, cb) {
            cb(null, file.originalname);
        }
    }),
    fileFilter : function (req, file, cb) {
        // Check if the file's MIME type is image/jpeg or image/png
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            // Allow the upload
            cb(null, true);
        } else {
            // Reject the upload with an error message
            cb(new Error('Only JPEG and PNG images are allowed'));
        }
    }
});

// const uploadFile = async (req, res) => {
//     try {
//         if (!req.files || req.files.length === 0) {
//             return res.status(400).send({ message: 'No files uploaded.' });
//         }

//         // // Iterate over each file uploaded
//         for (let i = 0; i < req.files.length; i++) {
//             const file = req.files[i];
            
//             // Construct input parameters for S3 PutObjectCommand
//             const input = {
//                 Bucket: bucket,
//                 Body: file.buffer, // Access buffer of each file
//                 Key: file.originalname // Access original name of each file
//             };      
            
//             // Create PutObjectCommand and send to S3
//             const command = new PutObjectCommand(input);
//             const response = await client.send(command);
            
//             console.log('File uploaded successfully:', file.originalname);
//             console.log('Response:', response);
//         }

//         // Send response after all files are uploaded
//         res.send({ message: response });
//         const url = [];
//     req.files.forEach((file) => {
//         url.push(file);
//       });

//     console.log(url);
//     res.json({url : url});

//     } catch (error) {
//         console.error('Error uploading files:', error);
//         res.status(400).json({ message: error.message });
//     }
// };


const uploadFileNew = async (req, res) => {
    // console.log(client.region)
    console.log("requested")
    const S3ClientConfig = {
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY
        },
        region: "ap-south-1",
        
        // region: process.env.BUCKET_REGION
    }
    
    // const ex = (req.files).split('/')[1];
    const ex = req.query.extension;
    console.log("ex    : " , ex)
    const imageName = `${crypto.randomBytes(64).toString("hex").substring(0, 10)}.${ex}`;
    console.log("imageName " + imageName)
    const clientConfig = new S3Client(S3ClientConfig);
    
    // const command = new GetObjectCommand({Bucket : bucket , Key : imageName});
    
    console.log("Accesss key :"  + process.env.AWS_ACCESS_KEY);
    console.log("Secret key :"  + process.env.AWS_SECRET_KEY);
    console.log("BUcket :"  + bucket);


    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: imageName,
      ContentType: `image/${ex}`,
    //   Metadata: { "Content-Type": "image/jpg" },
      Metadata: { "Content-Type": `image/${ex}` },
    });
    const url = await getSignedUrl( clientConfig, command, { expiresIn: 3600 });
    console.log("Pressigned url : " + url)
    res.json({url : url , imagekey: imageName })
}
const rollBackUploads = async (req,res) => {
    try {
        const {imageKeys} = req.body;
      for (const url of imageKeys) {
        const bucketParams = { Bucket: bucket, Key: url };
        const data = await client.send(new DeleteObjectCommand(bucketParams));
        if(data.$metadata.httpStatusCode != 204) return res.status(400).json({"message": "Delete object failed"});
        console.log("Success. Object deleted.", data.$metadata.httpStatusCode);
      }
      return "All objects deleted"; // For unit tests.
    } catch (err) {
      console.log("Error", err);
    }
  };
  

module.exports = {
    upload,
    // uploadFile,
    uploadFileNew,rollBackUploads
};
