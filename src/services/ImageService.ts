import { cloudinary } from "../config/cloudinary.js";

export const ImageService = {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    // Convert the file buffer to a base64 string
    const base64Image = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "autolease", // Organize images in a folder
    });

    // Return the secure URL of the uploaded image
    return result.secure_url;
  },

  async uploadMultipleImages(files: Express.Multer.File[]): Promise<string[]> {
    // Upload all files in parallel using Promise.all
    const uploadPromises = files.map((file) => this.uploadImage(file));
    return Promise.all(uploadPromises);
  },

  async deleteImage(imageUrl: string): Promise<void> {
    // Extract the public ID from the Cloudinary URL
    const urlParts = imageUrl.split("/");
    const fileName = urlParts[urlParts.length - 1].split(".")[0];
    const publicId = `autolease/${fileName}`;

    await cloudinary.uploader.destroy(publicId);
  },
};
