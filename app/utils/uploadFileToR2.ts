import AWS from 'aws-sdk';

const uploadFileToR2 = async (
  file: File,
  bucketName: string,
  folder: string,
  maximumFileSizeInMB: number
): Promise<string> => {

  const MAX_FILE_SIZE = maximumFileSizeInMB * 1024 * 1024; // 5MB in bytes

  // Check if the file exceeds the maximum size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds the maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)} MB.`);
  }

  const s3 = new AWS.S3({
    accessKeyId: process.env.NEXT_PUBLIC_R2_API_KEY_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_R2_API_ACCESS_TOKEN as string,
    endpoint: new AWS.Endpoint(process.env.NEXT_PUBLIC_R2_S3_API_URL as string),
    region: 'auto',
    signatureVersion: 'v4',
    s3ForcePathStyle: true,
  });

  const params: AWS.S3.PutObjectRequest = {
    Bucket: bucketName,
    Key: `${folder}/${file.name}`,
    Body: file,
    ContentType: file.type,
  };

  try {
    await s3.upload(params).promise();
    const downloadUrl = `${process.env.NEXT_PUBLIC_STORAGE_URL}/${folder}/${file.name}`
    console.log('File uploaded successfully:', downloadUrl);
    return downloadUrl;
  } catch (err) {
    console.error('Error uploading file:', err);
    throw err;
  }
};

export { uploadFileToR2 };
