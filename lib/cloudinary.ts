import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(
  base64Image: string,
  folder: string = "luxe-scents"
): Promise<string> {
  const result = await cloudinary.uploader.upload(base64Image, {
    folder,
    resource_type: "image",
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });
  return result.secure_url;
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export function getPublicId(url: string): string {
  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  return filename.split(".")[0];
}

export default cloudinary;
