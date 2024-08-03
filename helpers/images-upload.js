const multer = require('multer');
const path = require("path");

// Destination to store the Images 

const imageStorage = multer.diskStorage({

    destination: function (req, file, cb) {
    
        let folder = "";

        if(req.baseUrl.includes("users")) {
            folder = 'users';

        } else if (req.baseUrl.includes("pets")) {
            folder = 'pets';

        }

        cb(null, `public/images/${folder}`);

    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + String(Math.floor(Math.random() * 10 )) + path.extname(file.originalname));

    }

});


const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {

        if(!file.originalname.match(/\.(jpeg|jpg)$/)) {
            return cb(new Error("Please, send only images jpeg or jpg"))
        }
    cb(undefined, true);

    }
    
});



module.exports = { imageUpload };




