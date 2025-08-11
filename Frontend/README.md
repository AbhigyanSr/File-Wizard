# Hosting Static Site using S3

- Create Bucket, disable `Block all public access`, enable ACL.
- Under Objects upload `index.html`. Select the file > select Actions > select `Make Public using ACL`

  ![image](https://github.com/AbhigyanSr/File-Wizard/blob/207e889c2571a4c8cbbf56dd352d11c5c2df4ff9/assets/publicACL.png)

- Under Permissions > Bucket Policy add:
  
  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::file-wizard-webhosting/*"
        }
    ]
  }
  ```
- Under Properties > Enable `Static Website Hosting` and visit the html page from a browser using the URL endpoint from the tab.

  <p align="center"> 
    <img src="https://github.com/SourasishBasu/File-Wizard/blob/f6c84b0db1502d16cd6cf981eff464f1597c6aad/assets/staticsite.png" />
     <br><b>Static Site URL</b>
  </p>
