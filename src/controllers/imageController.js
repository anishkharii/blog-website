const { ImageUpload, ImageDelete } = require("../Cloudinary/imgHandler");

exports.uploadImage =  async (req, res) => {
    const file = req.file;
    const userId = req.id;
    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const result = await ImageUpload(file.path, userId);
        if (!result) {
            return res.status(500).json({ message: 'Error uploading image' });
        }
        res.status(200).json({ 
            message: 'Image uploaded successfully', 
            url: result.secure_url, 
            public_id: result.public_id 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading image', error });
    }
}

exports.deleteImage = async (req, res)=>{
    const public_url = req.body.url;
    const public_id = public_url.split('/').slice(7).join('/').replace(/\.[^/.]+$/, "");

    try{
        const result = await ImageDelete(public_id);

        if (!result) {
            return res.status(500).json({ message: 'Error deleting image', error });
        }
        res.status(200).json({ message: 'Image deleted successfully', result });
    }catch(err){
        res.status(500).json({ message: 'Error deleting image', error: err });
    }
}

