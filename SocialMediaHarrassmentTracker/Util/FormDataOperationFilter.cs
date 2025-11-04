using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Linq;
using Microsoft.AspNetCore.Mvc;

namespace SocialMediaHarrassmentTracker.Util
{
    public class FormDataOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            try
            {
                var hasFormData = context.MethodInfo.GetParameters().Any(p => p.ParameterType == typeof(IFormFile)) ||
                                  context.MethodInfo.GetCustomAttributes(true).Any(attr => attr is ConsumesAttribute consumes && consumes.ContentTypes.Contains("multipart/form-data"));

                if (hasFormData)
                {
                    operation.RequestBody = new OpenApiRequestBody
                    {
                        Content = new Dictionary<string, OpenApiMediaType>
                        {
                            ["multipart/form-data"] = new OpenApiMediaType
                            {
                                Schema = new OpenApiSchema
                                {
                                    Type = "object",
                                    Properties = new Dictionary<string, OpenApiSchema>
                                    {
                                        ["description"] = new OpenApiSchema { Type = "string", Description = "Complaint description" },
                                        ["image"] = new OpenApiSchema { Type = "string", Format = "binary", Description = "Image file" }
                                    },
                                    Required = new HashSet<string> { "description", "image" }
                                }
                            }
                        },
                        Description = "Form data for creating a complaint with image."
                    };
                    operation.Parameters?.Clear();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"FormDataOperationFilter error: {ex.Message}");
                throw;
            }
        }
    }
}