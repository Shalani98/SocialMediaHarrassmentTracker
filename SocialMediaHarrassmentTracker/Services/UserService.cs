using System.Data.Common;
using Microsoft.Data.SqlClient;
using BCrypt.Net;
using SocialMediaHarrassmentTracker.Util;
using SocialMediaHarrassmentTracker.Models;

namespace SocialMediaHarrassmentTracker.Services
{
    public class UserService
    {
        private readonly DBConnection db;  // ← FIXED!

        public UserService(DBConnection dbConnection)  // ← FIXED!
        {
            db = dbConnection;
        }

        public bool Register(Users model)
        {
            using var conn = db.GetConn();
            conn.Open();

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);
            string sql = "INSERT INTO Users(Name,Email,Password,Role,PhoneNumber,Address) VALUES(@Name,@Email,@Password,@Role,@PhoneNumber,@Address)";

            using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@Name", model.Name);
            cmd.Parameters.AddWithValue("@Email", model.Email);
            cmd.Parameters.AddWithValue("@Password", hashedPassword);
            cmd.Parameters.AddWithValue("@Role", model.Role);
            cmd.Parameters.AddWithValue("@PhoneNumber", model.PhoneNumber);
            cmd.Parameters.AddWithValue("@Address", model.Address);

            return cmd.ExecuteNonQuery() > 0;
        }

        public Users Login(string Email, string Password, string Role)
        {
            Users users = new Users();
            using var conn = db.GetConn();
            conn.Open();

            string sql = "SELECT * FROM Users WHERE Email=@Email AND Role=@Role";
            using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@Email", Email);
            cmd.Parameters.AddWithValue("@Role", Role);

            using var reader = cmd.ExecuteReader();
            if (reader.Read())
            {
                string storedHash = reader["Password"].ToString();
                if (BCrypt.Net.BCrypt.Verify(Password, storedHash))
                {
                    users = new Users
                    {
                        Id = (int)reader["Id"],
                        Email = reader["Email"].ToString(),
                        Password = storedHash,
                        Role = reader["Role"].ToString()
                    };
                }
            }
            return users;
        }

        public bool Update(Users model)
        {
            using var conn = db.GetConn();
            conn.Open();

            string sql = "UPDATE Users SET Name=@Name, Password=@Password, PhoneNumber=@PhoneNumber, Address=@Address WHERE Email=@Email";
            using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@Name", model.Name);
            cmd.Parameters.AddWithValue("@Email", model.Email);
            cmd.Parameters.AddWithValue("@Password", BCrypt.Net.BCrypt.HashPassword(model.Password));
            cmd.Parameters.AddWithValue("@PhoneNumber", model.PhoneNumber);
            cmd.Parameters.AddWithValue("@Address", model.Address);

            return cmd.ExecuteNonQuery() > 0;
        }
    }
}