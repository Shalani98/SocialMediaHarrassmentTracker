# Social Media Harassment Tracker 🚨

A full-stack web application to track and report social media harassment incidents.

## 🖥️ Project Structure
- **Backend:** ASP.NET Core (C#) — AWS S3 integration for image storage  
- **Frontend:** React (socialtrackerwebfront)  
- **Database:** AWS RDS / SQL Server  

## ⚙️ Technologies Used
- .NET 8 / ASP.NET Core Web API  
- React.js  
- AWS (S3, EC2, RDS, IAM, VPC)  
- Entity Framework Core  
- GitHub Actions (optional for CI/CD)

## ☁️ AWS Infrastructure Setup
The application is hosted and managed entirely on AWS:

- **Amazon EC2:** Hosts the ASP.NET Core backend API  
- **Amazon RDS:** Manages the SQL Server database  
- **Amazon S3:** Stores uploaded harassment evidence (images/videos)  
- **AWS IAM:** Provides secure access control and permissions for AWS services  
- **Amazon VPC:** Ensures network isolation and secure communication between components  

## 🧭 Accessing AWS Services in Visual Studio
To connect and manage AWS resources directly:
1. Install **AWS Toolkit for Visual Studio** (via Extensions → Manage Extensions).  
2. Open **AWS Explorer** from the “View” menu.  
3. Add your AWS account credentials or profile.  
4. Expand to view and manage services such as **S3**, **RDS**, **Lambda**, or **EC2**.

## 🚀 Deployment
To deploy:
1. Configure your AWS credentials locally (never commit them to GitHub).
2. Run the backend:
   ```bash
   dotnet run --project SocialMediaHarassmentTracker
3.Deploy to EC2 (or Elastic Beanstalk) as per AWS Toolkit publish settings.

🛡️ License
This project is licensed under the MIT License — you’re free to use and modify with attribution.
