using Mukies.Domain.Entities;
using Mukies.Domain.Interfaces;

namespace Mukies.API.Services;

public static class InitialAdminInitializer
{
    public static async Task InitializeAsync(IServiceProvider services, IConfiguration configuration)
    {
        var username = configuration["InitialAdmin:Username"]?.Trim();
        var password = configuration["InitialAdmin:Password"];

        if (string.IsNullOrWhiteSpace(username) && string.IsNullOrWhiteSpace(password))
            return;

        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
            throw new InvalidOperationException("InitialAdmin:Username e InitialAdmin:Password devem ser informados juntos.");

        if (password.Length < 12)
            throw new InvalidOperationException("InitialAdmin:Password deve ter pelo menos 12 caracteres.");

        var users = services.GetRequiredService<IUserRepository>();
        var existingUser = await users.GetByUsernameAsync(username);

        if (existingUser is not null)
        {
            existingUser.Role = "Admin";
            existingUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
            await users.UpdateAsync(existingUser);
            return;
        }

        await users.AddAsync(new User
        {
            Username = username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            Role = "Admin"
        });
    }
}
