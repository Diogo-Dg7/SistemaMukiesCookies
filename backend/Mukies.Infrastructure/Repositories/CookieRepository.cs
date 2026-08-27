using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Mukies.Domain.Entities;
using Mukies.Domain.Interfaces;
using Mukies.Infrastructure.Data;

namespace Mukies.Infrastructure.Repositories;

public class CookieRepository : ICookieRepository
{
    private readonly AppDbContext _context;

    public CookieRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Cookie>> GetAllAsync()
    {
        return await _context.Cookies.Where(c => c.IsActive).ToListAsync();
    }

    public async Task<Cookie?> GetByIdAsync(Guid id)
    {
        return await _context.Cookies.FirstOrDefaultAsync(c => c.Id == id && c.IsActive);
    }

    public async Task AddAsync(Cookie cookie)
    {
        await _context.Cookies.AddAsync(cookie);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Cookie cookie)
    {
        _context.Cookies.Update(cookie);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var cookie = await GetByIdAsync(id);
        if (cookie != null)
        {
            cookie.IsActive = false; // Soft delete (desativa sem apagar do banco)
            await UpdateAsync(cookie);
        }
    }
}