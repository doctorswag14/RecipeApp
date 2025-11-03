using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BCrypt.Net;
using RecipeBackend.Data;
using RecipeBackend.DTO;
using RecipeBackend.Models;

namespace RecipeBackend.Controller
{
    [ApiController]
    [Route("api/auth/")]
    public class AuthController : ControllerBase
    {
        private readonly RecipeContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(RecipeContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO data)
        {
            try
            {

                if (await _context.AppUsers.AnyAsync(u => u.Username == data.Username || u.Email == data.Email))
                {
                    return BadRequest(new { message = "Username or Email already exists." });
                }

                DateTime today = DateTime.Today;
                var birthdate = data.DateOfBirth.Value;
                int age = today.Year - birthdate.Year;
                if (birthdate.Date > today.AddYears(-age))
                {
                    age--;
                }

                if (age >= 13)
                {
                    var hashedPassword = BCrypt.Net.BCrypt.HashPassword(data.Password);
                    var user = new AppUsers
                    {
                        FirstName = data.FirstName,
                        LastName = data.LastName,
                        FullName = data.FirstName + " " + data.LastName,
                        DateOfBirth = data.DateOfBirth,
                        Email = data.Email,
                        Username = data.Username,
                        Password = hashedPassword
                    };
                    _context.AppUsers.Add(user);
                    await _context.SaveChangesAsync();

                    return Ok(new { message = "User registered successfully" });
                }
                else
                {
                    return BadRequest(new { message = "User is not old enough to create a accout!" });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return Ok();
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO data)
        {
            var user = await _context.AppUsers.SingleOrDefaultAsync(u => u.Username == data.Username || u.Email == data.Username);

            if (user != null)
            {
                var passwordCheck = BCrypt.Net.BCrypt.Verify(data.Password, user.Password);

                if (passwordCheck == true)
                {
                    try
                    {
                        var token = GenerateJwtToken(user);
                        return Ok(new
                        {
                            token,
                            username = user.Username
                        });
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.ToString());
                        return BadRequest(ex.ToString());
                    }

                }
                else
                {
                    return Unauthorized(new { message = "Invalid credentials" });
                }
            }
            else
            {
                return Unauthorized(new { message = "No User found with that email or password" });
            }
        }

        private string GenerateJwtToken(AppUsers user)
        {
            var key = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(key))
                throw new ArgumentNullException(nameof(key), "JWT key cannot be null or empty.");

            // Convert plain text key to bytes
            var keyBytes = Encoding.UTF8.GetBytes(key);

            if (keyBytes.Length < 32) // Require at least 256 bits (32 bytes)
                throw new ArgumentException("JWT key must be at least 32 bytes long.");

            var securityKey = new SymmetricSecurityKey(keyBytes);
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var username = user?.Username ?? throw new ArgumentNullException(nameof(user.Username), "User username cannot be null.");
            var claims = new[]
            {
        new Claim(JwtRegisteredClaimNames.Sub, username),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

            var issuer = _configuration["Jwt:Issuer"];
            if (string.IsNullOrEmpty(issuer))
                throw new ArgumentNullException(nameof(issuer), "JWT issuer cannot be null or empty.");

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: issuer,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}