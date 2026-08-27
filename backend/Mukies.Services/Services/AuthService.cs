using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Mukies.Domain.Entities;
using Mukies.Domain.Interfaces;
using Mukies.Services.DTOs;

namespace Mukies.Services.Services;

public class AuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;

    public AuthService(IUserRepository userRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
    }

    public async Task<bool> RegisterAsync(RegisterDto dto)
    {
        var username = dto.Username.Trim();
        var existingUser = await _userRepository.GetByUsernameAsync(username);
        if (existingUser != null) return false;

        var user = new User
        {
            Username = username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = "User"
        };

        await _userRepository.AddAsync(user);
        return true;
    }

    public async Task<string?> LoginAsync(LoginDto dto)
    {
        var user = await _userRepository.GetByUsernameAsync(dto.Username.Trim());
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return null; // Senha inválida ou usuário não existe

        return GenerateJwtToken(user);
    }

    private string GenerateJwtToken(User user)
    {
        var secretKey = _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("A configuração Jwt:Key é obrigatória.");
        var issuer = _configuration["Jwt:Issuer"]
            ?? throw new InvalidOperationException("A configuração Jwt:Issuer é obrigatória.");
        var audience = _configuration["Jwt:Audience"]
            ?? throw new InvalidOperationException("A configuração Jwt:Audience é obrigatória.");
        var expirationMinutes = int.TryParse(_configuration["Jwt:ExpirationMinutes"], out var configuredExpiration)
            ? configuredExpiration
            : 480;

        if (expirationMinutes <= 0)
            throw new InvalidOperationException("Jwt:ExpirationMinutes deve ser maior que zero.");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
