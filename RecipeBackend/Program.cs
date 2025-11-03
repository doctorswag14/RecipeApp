using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using RecipeBackend.Data;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddDbContext<RecipeContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
                     new MySqlServerVersion(new Version(8, 0, 23)))); // Adjust version if necessary

builder.Services.AddControllers();

// Configure CORS to allow all origins
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policyBuilder => policyBuilder
            .AllowAnyOrigin()   // Allow all origins
            .AllowAnyMethod()   // Allow any HTTP method (GET, POST, etc.)
            .AllowAnyHeader());   // Allow any headers
            //.AllowCredentials()); // Include if using credentials (cookies)
});

var app = builder.Build();

// Set the WebHost URL to use `thomashometech.local`
//app.Urls.Add("http://thomashometech.local/api/homerecipes");

// Display message in the console when the app starts
//Console.WriteLine("API is running at: http://thomashometech.local:8080/data");

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// Apply the CORS policy (using "AllowAll")
app.UseCors("AllowAll");

// Serve static files from the root directory (where `index.html` is located)
app.UseStaticFiles(); // This will serve static files (like `index.html`) from the root directory

// Serve `index.html` at the root path
//app.MapGet("/", () => Results.File("index.html"));

// Serve static files from the "Images" folder, accessible at `/data/Images`
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(app.Environment.ContentRootPath, "Images")),
    RequestPath = "/Images"
});

// Ensure static files and routes are served correctly
app.UseRouting();

// Apply Authorization middleware
app.UseAuthorization();

// Map the API controllers with the base path `/data`
app.MapControllers();

// Run the app
//app.Run("http://thomashometech.local:8080");
app.Run();