const multer = require('multer')
const path = require('path')

module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/jpe|jpeg|png/)) {
        cb(new Error("File is not supported"), false);
        return;
      }
      cb(null, true);
    },
  });

// //Set Storage
// const storage = multer.diskStorage({
//     destination: './public/upload',
//     filename: (req, file, cb)=>{
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
//     }
// })

// //Init upload
// module.exports = multer({
//     storage: storage,
//     limits: {fileSize: 10000000},
//     fileFilter: (req, file, cb)=>{
//         checkFileType(file, cb)
        
//     }
// }).single('myImage')


// //Check File Type
// function checkFileType(file, cb){
//     //Allowed extensions
//     filetypes = /jpeg|jpg|png/
//     //Check extension
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
//     //Check mimetype
//     const mimetype = filetypes.test(file.mimetype)

//     if(mimetype && extname){
//         return cb(null, true)
//     }
//     else{
//         return cb("Error: Only images")
//     }
// }

