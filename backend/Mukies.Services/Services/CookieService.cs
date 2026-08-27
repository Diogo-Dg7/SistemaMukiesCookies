using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Mukies.Domain.Entities;
using Mukies.Domain.Interfaces;
using Mukies.Services.DTOs;
using Mukies.Services.Interfaces;

namespace Mukies.Services.Services;

public class CookieService : ICookieService
{
    private readonly ICookieRepository _repository;

    public CookieService(ICookieRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<CookieDto>> GetAllAsync()
    {
        var cookies = await _repository.GetAllAsync();
        return cookies.Select(c => new CookieDto
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description,
            Price = c.Price,
            ImageUrl = c.ImageUrl,
            IsActive = c.IsActive
        });
    }

    public async Task<CookieDto?> GetByIdAsync(Guid id)
    {
        var cookie = await _repository.GetByIdAsync(id);
        if (cookie == null) return null;

        return new CookieDto
        {
            Id = cookie.Id,
            Name = cookie.Name,
            Description = cookie.Description,
            Price = cookie.Price,
            ImageUrl = cookie.ImageUrl,
            IsActive = cookie.IsActive
        };
    }

    public async Task<CookieDto> CreateAsync(CreateCookieDto dto)
    {
        var cookie = new Cookie
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            ImageUrl = dto.ImageUrl
        };

        await _repository.AddAsync(cookie);

        return new CookieDto
        {
            Id = cookie.Id,
            Name = cookie.Name,
            Description = cookie.Description,
            Price = cookie.Price,
            ImageUrl = cookie.ImageUrl,
            IsActive = cookie.IsActive
        };
    }

    public async Task<bool> UpdateAsync(Guid id, CreateCookieDto dto)
    {
        var existingCookie = await _repository.GetByIdAsync(id);
        if (existingCookie == null) return false;

        existingCookie.Name = dto.Name;
        existingCookie.Description = dto.Description;
        existingCookie.Price = dto.Price;
        existingCookie.ImageUrl = dto.ImageUrl;

        await _repository.UpdateAsync(existingCookie);
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var cookie = await _repository.GetByIdAsync(id);
        if (cookie == null) return false;

        await _repository.DeleteAsync(id);
        return true;
    }
}
