using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Mukies.Domain.Entities;

namespace Mukies.Domain.Interfaces;

public interface ICookieRepository
{
    Task<IEnumerable<Cookie>> GetAllAsync();
    Task<Cookie?> GetByIdAsync(Guid id);
    Task AddAsync(Cookie cookie);
    Task UpdateAsync(Cookie cookie);
    Task DeleteAsync(Guid id);
}