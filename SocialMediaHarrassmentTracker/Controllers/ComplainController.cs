using Amazon.S3;
using Amazon.S3.Transfer;
using Microsoft.AspNetCore.Mvc;
using SocialMediaHarrassmentTracker.Models;
using SocialMediaHarrassmentTracker.Services;
using static System.Net.Mime.MediaTypeNames;

namespace SocialMediaHarrassmentTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ComplainController : ControllerBase
    {
        private readonly ComplainService _complainService;
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName = "social-media-complains-images";

        // 🔥 FIX 1: ADD CONSTRUCTOR!
       public ComplainController(ComplainService complainService)
{
    _complainService = complainService;

    var accessKey = Environment.GetEnvironmentVariable("AWS_ACCESS_KEY_ID");
    var secretKey = Environment.GetEnvironmentVariable("AWS_SECRET_ACCESS_KEY");

    var credentials = new BasicAWSCredentials(accessKey, secretKey);

    _s3Client = new AmazonS3Client(credentials, Amazon.RegionEndpoint.USEast1);
}

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromForm] Complain model)
        {
            if (model == null)
                return BadRequest("Invalid");



            //Handle File Upload
            if (model.ImageFile != null && model.ImageFile.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(model.ImageFile.FileName);





                using (var newMemoryStream = new MemoryStream())
                {
                    await model.ImageFile.CopyToAsync(newMemoryStream);

                    var uploadRequest = new TransferUtilityUploadRequest
                    {
                        InputStream = newMemoryStream,
                        Key = fileName,
                        BucketName = _bucketName,
                        ContentType = model.ImageFile.ContentType,
                       



                    };

                    var fileTransferUtility = new TransferUtility(_s3Client);
                    await fileTransferUtility.UploadAsync(uploadRequest);
                    model.ImageUrl = $"https://social-media-complains-images.s3.amazonaws.com/{fileName}";

                }

            }
                bool result = _complainService.Create(model);
                return result ? Ok("Request Created Successfully") : BadRequest("Cannot create request");
            }

            [HttpPost("Approve/{Complain_Id}")]
            public IActionResult Approve(int Complain_Id)
            {
                // 🔥 FIX 2: int <= 0 NOT null!
                if (Complain_Id <= 0)
                    return BadRequest("Invalid");

                // 🔥 FIX 3: CHECK RESULT!
                bool result = _complainService.Approve(Complain_Id);
                return result ? Ok("Request Approved") : BadRequest("Cannot approve");
            }

            [HttpPost("Reject/{Complain_Id}")]
            public IActionResult Reject(int Complain_Id)
            {
                // 🔥 FIX 2: int <= 0 NOT null!
                if (Complain_Id <= 0)
                    return BadRequest("Invalid");

                // 🔥 FIX 3: CHECK RESULT!
                bool result = _complainService.Reject(Complain_Id);
                return result ? Ok("Request Rejected") : BadRequest("Cannot reject");
            }

            [HttpGet("GetAll")]
            public IActionResult GetAll()
            {
                var complains = _complainService.GetAll();
                return Ok(complains);
            }
        }
    } 
