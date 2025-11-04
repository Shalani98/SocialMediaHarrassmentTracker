namespace SocialMediaHarrassmentTracker.Models
{
    public class Users
    {
        public int Id { get; set; } // Primary Key, Identity

        public string Name { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string Role { get; set; } 

        public string PhoneNumber { get; set; }

        public string Address { get; set; }
    }
}
