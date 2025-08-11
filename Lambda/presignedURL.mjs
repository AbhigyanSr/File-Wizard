import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Create S3 client
const s3Client = new S3Client({ region: process.env.AWS_REGION });

// Main Lambda entry point
export const handler = async (event) => {
  return await getUploadURL(event);
};

const getUploadURL = async function(event) {
  const randomID = parseInt(Math.random() * 10000000);
  const Key = `${randomID}.docx`; // Change file extension according to upload type

  // Get signed URL from S3
  const s3Params = {
    Bucket: process.env.UploadBucket,
    Key: Key,
    ContentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Change MIME type depending file upload
  };

  console.log('Params: ', s3Params);

  try {
    // Generate presigned URL
    const uploadURL = await getSignedUrl(s3Client, new PutObjectCommand(s3Params), {expiresIn: 300});

    // SUCCESS RESPONSE WITH CORS HEADERS
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "GET,OPTIONS"
      },
      body: JSON.stringify({ uploadURL: uploadURL, Key: Key }),
    };

    return response;

  } catch (error) {
    console.error('Error generating presigned URL:', error);

    // ERROR RESPONSE WITH CORS HEADERS
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS
      },
      body: JSON.stringify({ message: 'Error generating presigned URL' }),
    };
  }
};