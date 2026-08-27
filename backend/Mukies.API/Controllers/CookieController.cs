using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mukies.Services.DTOs;
using Mukies.Services.Interfaces;

namespace Mukies.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CookieController : ControllerBase
{
    private readonly ICookieService _service;

    public CookieController(ICookieService service)
    {
        _service = service;
    }

    // GET: api/Cookie (Público - Vitrine do Cliente)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CookieDto>>> GetAll()
    {
        var cookies = await _service.GetAllAsync();
        return Ok(cookies);
    }

    // GET: api/Cookie/{id} (Público - Detalhes do Produto)
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CookieDto>> GetById(Guid id)
    {
        var cookie = await _service.GetByIdAsync(id);
        if (cookie == null) return NotFound("Cookie não encontrado.");
        return Ok(cookie);
    }

    // POST: api/Cookie (Restrito - Apenas Admin logado com JWT)
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<CookieDto>> Create([FromBody] CreateCookieDto dto)
    {
        var cookie = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = cookie.Id }, cookie);
    }

    // PUT: api/Cookie/{id} (Restrito - Apenas Admin logado com JWT)
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CreateCookieDto dto)
    {
        var result = await _service.UpdateAsync(id, dto);
        if (!result) return NotFound("Cookie não encontrado para atualização.");
        return NoContent();
    }

    // DELETE: api/Cookie/{id} (Restrito - Apenas Admin logado com JWT)
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _service.DeleteAsync(id);
        if (!result) return NotFound("Cookie não encontrado.");
        return NoContent();
    }
}
