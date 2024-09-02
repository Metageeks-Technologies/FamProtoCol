// s3Service.ts
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3 from '../awsConfig';

// Generate a presigned URL for uploading
export const generateUploadPresignedUrl = async (key: string, expiresIn: number = 3600): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });

  try {
    const url = await getSignedUrl(s3, command, { expiresIn });
    return url;
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw error;
  }
};

// Generate a presigned URL for retrieving
export const generateGetPresignedUrl = async (key: string, expiresIn: number = 3600): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });
  try {
    const url = await getSignedUrl(s3, command, { expiresIn });
    return url;
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw error;
  }
};
