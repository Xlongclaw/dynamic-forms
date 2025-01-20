import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"; // Import getSignedUrl from the request presigner package
import { v4 as uuidv4 } from "uuid";

// Initialize S3 client for R2
const s3Client = new S3Client({
  region: "auto", // Use "auto" for R2 as it doesn't require a specific region
  endpoint: process.env.R2_S3_API_URL!,
  credentials: {
    accessKeyId: process.env.R2_API_KEY_ID!,
    secretAccessKey: process.env.R2_API_ACCESS_TOKEN!,
  },
});

interface UploadParams {
  extension: string;
  type: string;
}


export const getUploadUrl = async ({ extension, type }: UploadParams): Promise<any> => {
  // Validate extension
  const validExtensions = ["png", "jpg", "jpeg", "svg"];
  if (!extension || !validExtensions.includes(extension)) {
    throw new Error("Extension must be one of [png, jpg, jpeg, svg]");
  }

  // Validate type
  const validTypes = ["Services", "Food", "Avatar"];
  if (!validTypes.includes(type)) {
    throw new Error("Type is required & must be one of [Services, Food, Avatar]");
  }

  // Generate unique file name and key for the upload
  const name = uuidv4();
  const key = `${type}/${name}.${extension}`;

  // Create a command to upload the file to R2
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME!,
    Key: key,
    ContentType: "application/octet-stream", // You can customize this based on file type
  });

  // Generate signed URL for the upload
  try {
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 36000 }); // expiresIn is in seconds (10 hours)

    // Generate the download URL (public URL of the uploaded file)
    const baseStorageUrl = process.env.STORAGE_URL!;
    const downloadUrl = `${baseStorageUrl}/${key}`;

    return {
      success: true,
      uploadUrl: signedUrl,
      fileName: name,
      downloadUrl: downloadUrl,
      key: key,
    };
  } catch (e) {
    throw new Error("Something went wrong while generating the upload URL");
  }
};
