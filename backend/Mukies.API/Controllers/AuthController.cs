using Microsoft.AspNetCore.Mvc;
using Mukies.Services.DTOs;
using Mukies.Services.Services;

namespace Mukies.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var result = await _authService.RegisterAsync(dto);
        if (!result) return BadRequest("Usuário já existe.");
        return Ok("Usuário cadastrado com sucesso.");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var token = await _authService.LoginAsync(dto);
        if (token == null) return Unauthorized("Usuário ou senha inválidos.");
        return Ok(new { Token = token });
    }
}