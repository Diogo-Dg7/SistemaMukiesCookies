using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Mukies.Domain.Entities;

namespace Mukies.Domain.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByUsernameAsync(string username);
    Task AddAsync(User user);
    Task UpdateAsync(User user);
}
