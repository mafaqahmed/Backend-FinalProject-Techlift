const cloudinary = require('cloudinary');
const env = require('env').config();

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
  });

const cloudinaryUploadImg = async(filetoupload) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(filetoupload, (result) => {
            resolve(
                {
                    url: result.secure_url
                },
                {
                    resource_type: 'auto'
                }
            )
        })
    })
}

module.exports = {cloudinaryUploadImg}