using System.Data.Common;
using Microsoft.Data.SqlClient;

using SocialMediaHarrassmentTracker.Util;
using SocialMediaHarrassmentTracker.Models;
using Microsoft.AspNetCore.Mvc;
using Azure.Core;
namespace SocialMediaHarrassmentTracker.Services
{
    public class ComplainService
    {
        private readonly DBConnection db;


        public ComplainService(IConfiguration configuration)
        {
            db = new DBConnection(configuration);
        }

        public bool Create(Complain model)
        {
            using var conn = db.GetConn();
            conn.Open();

            string sql = "INSERT INTO Complain(Description,Status,ImageUrl) VALUES(@Description,@Status,@ImageUrl)";
            using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@Description", model.Description);
            cmd.Parameters.AddWithValue("@Status", "Pending");
            cmd.Parameters.AddWithValue("@ImageUrl", (object)model.ImageUrl ?? DBNull.Value);

            return cmd.ExecuteNonQuery() > 0;
        }

        public bool Approve(int Complain_Id)
        {
            using var conn = db.GetConn();
            conn.Open();

            string sql = "UPDATE Complain SET Status='Accepted' WHERE Complain_Id=@Complain_Id AND Status='Pending'";
            using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@Complain_Id", Complain_Id);

            return cmd.ExecuteNonQuery() > 0;
        }

        public bool Reject(int Complain_Id)
        {
            using var conn = db.GetConn();
            conn.Open();

            string sql = "UPDATE Complain SET Status='Rejected' WHERE Complain_Id=@Complain_Id AND Status='Pending'";
            using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@Complain_Id", Complain_Id);

            return cmd.ExecuteNonQuery() > 0;
        }

        public List<Complain> GetAll()
        {
            List<Complain> complains = new List<Complain>();
            using var conn = db.GetConn();
            conn.Open();

            string sql = "SELECT * FROM Complain";
            using var cmd = new SqlCommand(sql, conn);
            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                complains.Add(new Complain
                {
                    Complain_Id = (int)reader["Complain_Id"],
                    Description = reader["Description"].ToString(),
                    Status = reader["Status"].ToString(),
                    ImageUrl = reader["ImageUrl"]  != DBNull.Value  ? reader["ImageUrl"].ToString() : null
                });
            }
            return complains;
        }
    }
}
