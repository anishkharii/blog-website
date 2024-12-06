const cloudinary = require('cloudinary').v2;
require('dotenv').config()
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
});

exports.uploadImage = async(path)=>{

    try{

        const image = await cloudinary.uploader.upload(path);
        console.log("Image Uploaded");
        return image.secure_url;
    }catch(err){
        console.log(err);
    }

}

