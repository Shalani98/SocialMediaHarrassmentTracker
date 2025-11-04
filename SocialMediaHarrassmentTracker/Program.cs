using Amazon.S3;
using Microsoft.Data.SqlClient;
using Microsoft.OpenApi.Models;
using SocialMediaHarrassmentTracker.Services;
using SocialMediaHarrassmentTracker.Util;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// ----------------------
// Add services
// ----------------------
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

builder.Services.AddSingleton<DBConnection>(provider =>
{
    var config = provider.GetRequiredService<IConfiguration>();
    return new DBConnection(config);
});
builder.Services.AddSingleton<UserService>();
builder.Services.AddSingleton<ComplainService>();
builder.Services.AddAWSService<IAmazonS3>();


// ----------------------
// Add Swagger
// ----------------------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Social Media Harassment Tracker API"
    });

});

// ----------------------
// CORS policy
// ----------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ----------------------
// Build app
// ----------------------
var app = builder.Build();
Console.WriteLine("🔥 APP STARTED 🔥");

// ----------------------
// Async DB Test
// ----------------------
async Task TestDbConnectionAsync()
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<DBConnection>();

    try
    {
        Console.WriteLine("🚀 Testing DB connection...");
        await db.OpenAsync();

        using var cmd = new SqlCommand("SELECT @@VERSION", db.GetConn());
        var version = await cmd.ExecuteScalarAsync();
        Console.WriteLine($"✅ DB Connected! SQL Server version: {version}");

        await db.CloseAsync();
    }
    catch (Exception ex)
    {
        Console.WriteLine("💥 DB connection failed!");
        Console.WriteLine($"Type: {ex.GetType().Name}");
        Console.WriteLine($"Message: {ex.Message}");
        Console.WriteLine($"Inner: {ex.InnerException?.Message}");
        Console.WriteLine($"Stack: {ex.StackTrace}");
    }
}

// Run DB test without blocking startup
Console.WriteLine("🚀 Testing DB connection...");
_ = TestDbConnectionAsync();

// ----------------------
// HTTP pipeline
// ----------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "SMHT API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("AllowReactApp");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
