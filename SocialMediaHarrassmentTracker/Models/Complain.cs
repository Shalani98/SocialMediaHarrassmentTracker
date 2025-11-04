namespace SocialMediaHarrassmentTracker.Models
{
    public class Complain
    {public int Complain_Id { get; set; }

     public string Description { get; set; }

        public string Status { get; set; }


        // For uploading file
        [System.ComponentModel.DataAnnotations.Schema.NotMapped]
        public IFormFile ImageFile { get; set; }

        //For saving path in DB
        public string ImageUrl { get; set; }
    }
}
