import requests
import os

def lambda_handler(event, context):
    try:
        # Get the EC2 IP from an environment variable for easier management
        ec2_ip = os.environ['EC2_PUBLIC_IP']

        # Parse event records for bucket name and file key
        key = event['Records'][0]['s3']['object']['key']
        filename, extension = os.path.splitext(key)
        extension = extension.lower()

        print(f"New file submitted: {key}")

        url = ""
        if extension == '.docx':
            url = f"http://{ec2_ip}:8000/{filename}"
        elif extension == '.png':
            url = f"http://{ec2_ip}:8001/{filename}"
        else:
            print(f"Unsupported file type: {extension}")
            return {'statusCode': 400, 'body': 'Unsupported file type'}

        print(f"Sending POST request to: {url}")
        response = requests.post(url)
        response.raise_for_status() # Raises an exception for bad status codes

        print('POST request successful!')
        return {
            'statusCode': 200,
            'body': response.text
        }
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': f"Error processing file: {str(e)}"
        }