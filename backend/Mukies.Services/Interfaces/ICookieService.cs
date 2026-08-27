using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Mukies.Services.DTOs;

namespace Mukies.Services.Interfaces;

public interface ICookieService
{
    Task<IEnumerable<CookieDto>> GetAllAsync();
    Task<CookieDto?> GetByIdAsync(Guid id);
    Task<CookieDto> CreateAsync(CreateCookieDto dto);
    Task<bool> UpdateAsync(Guid id, CreateCookieDto dto);
    Task<bool> DeleteAsync(Guid id);
}