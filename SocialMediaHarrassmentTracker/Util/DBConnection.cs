using System;
using System.Data;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace SocialMediaHarrassmentTracker.Util
{
    public class DBConnection : IDisposable
    {
        private SqlConnection _connection;
        private readonly IConfiguration _configuration;

        public DBConnection(IConfiguration configuration)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            var conString = _configuration.GetConnectionString("DefaultConnection");

            if (string.IsNullOrEmpty(conString))
            {
                throw new InvalidOperationException("❌ Connection string is missing or not configured correctly in appsettings.json.");
            }

            _connection = new SqlConnection(conString);
            Console.WriteLine("✅ DBConnection Initialized Successfully");
        }

        public SqlConnection GetConn()
        {
            var conString = _configuration.GetConnectionString("DefaultConnection");

            if (string.IsNullOrEmpty(conString))
                throw new InvalidOperationException("Connection string is missing or invalid in appsettings.json");

            return new SqlConnection(conString);
        }


        // Async open
        public async Task OpenAsync()
        {
            if (_connection == null)
                throw new InvalidOperationException("Connection is not initialized.");

            if (_connection.State != ConnectionState.Open)
                await _connection.OpenAsync();
        }

        // Async close
        public async Task CloseAsync()
        {
            if (_connection != null && _connection.State == ConnectionState.Open)
                await _connection.CloseAsync();
        }

        // Dispose pattern
        public void Dispose()
        {
            if (_connection != null)
            {
                if (_connection.State == ConnectionState.Open)
                    _connection.Close();
                _connection.Dispose();
                _connection = null;
            }
        }
    }
}
