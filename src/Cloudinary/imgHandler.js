const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config();


cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
});

exports.ImageUpload = async (path, userId) => {
    try {
        const uploadResponse = await cloudinary.uploader.upload(path, {
            folder: `users/${userId}`,
            use_filename: true,
            unique_filename: false,
        });

        fs.unlinkSync(path);
        return uploadResponse; 
    } catch (err) {
        console.log("Error uploading image:", err);
    }
};

exports.ImageDelete = async (publicId) => {
    try {
        const deleteResponse = await cloudinary.uploader.destroy(publicId);
        return deleteResponse;
    } catch (err) {
        console.log("Error deleting image:", err);
    }
};
