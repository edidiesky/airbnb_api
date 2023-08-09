
import dotenv from "dotenv";
dotenv.config();
import cloudinary from 'cloudinary';

const cloudinaryModule = cloudinary.v2
console.log(
  process.env.cloud_name
)


cloudinaryModule.config({ 
  cloud_name:  process.env.cloud_name, 
  api_key:  process.env.cloud_key, 
  api_secret: process.env.cloud_secret
});

export default cloudinaryModule