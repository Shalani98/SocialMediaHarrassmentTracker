using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using SocialMediaHarrassmentTracker.Models;
using SocialMediaHarrassmentTracker.Services;

namespace SocialMediaHarrassmentTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService userService;  // ← FIXED!

        public UserController(UserService userService)  // ← FIXED!
        {
            this.userService = userService;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] Users model)
        {
            if (model == null)
            {
                return BadRequest("Register is invalid");
            }
            bool result = userService.Register(model);
            return result ? Ok("Registered Successfully.") : BadRequest("Cannot register");
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] Login model)
        {
            if (model == null || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
            {
                return BadRequest("Type the credentials correctly");
            }
            var user = userService.Login(model.Email, model.Password, model.Role);

            if (user.Id == 0)  // ← FIXED: Check Id instead of null
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            return Ok(new { message = "Login successful", role = model.Role });
        }

        [HttpPost("update")]
        public IActionResult Update([FromBody] Users model)
        {
            if (model == null)
            {
                return BadRequest("Can't Update");
            }
            bool update = userService.Update(model);
            return update ? Ok("Users updated successfully.") : BadRequest("Update failed");
        }

        [HttpGet("GetAll")]
        public IActionResult GetAll()
        {
            var users = userService.GetAll();
            return Ok(users);
        }
    }
}
