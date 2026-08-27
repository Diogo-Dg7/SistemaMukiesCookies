using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Mukies.API.Middlewares;
using Mukies.API.Services;
using Mukies.Domain.Interfaces;
using Mukies.Infrastructure.Data;
using Mukies.Infrastructure.Repositories;
using Mukies.Services.Interfaces;
using Mukies.Services.Services;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);
var dotenvValues = LoadDotEnv(Path.Combine(builder.Environment.ContentRootPath, ".env"));
builder.Configuration.AddInMemoryCollection(dotenvValues);
builder.Configuration.AddEnvironmentVariables();
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

var renderPort = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrWhiteSpace(renderPort))
    builder.WebHost.UseUrls($"http://0.0.0.0:{renderPort}");

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? builder.Configuration["DATABASE_URL"]
    ?? throw new InvalidOperationException("ConnectionStrings:DefaultConnection deve ser configurada.");
connectionString = NormalizePostgreSqlConnectionString(connectionString);

// 1. Configuração do DbContext com SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString, postgresOptions => postgresOptions.EnableRetryOnFailure()));

// 2. Injeção de Dependência dos Repositórios
builder.Services.AddScoped<ICookieRepository, CookieRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// 3. Injeção de Dependência dos Serviços
builder.Services.AddScoped<ICookieService, CookieService>();
builder.Services.AddScoped<AuthService>();

// 4. Configurar Autenticação JWT
var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("A configuração Jwt:Key é obrigatória.");
var jwtIssuer = builder.Configuration["Jwt:Issuer"]
    ?? throw new InvalidOperationException("A configuração Jwt:Issuer é obrigatória.");
var jwtAudience = builder.Configuration["Jwt:Audience"]
    ?? throw new InvalidOperationException("A configuração Jwt:Audience é obrigatória.");

if (Encoding.UTF8.GetByteCount(jwtKey) < 32)
    throw new InvalidOperationException("Jwt:Key deve ter pelo menos 32 bytes.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,
            ValidateAudience = true,
            ValidAudience = jwtAudience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1)
        };
    });
builder.Services.AddAuthorization();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// 5. Configurar Swagger com Suporte ao Token JWT (Sintaxe OpenAPI v2.0+)
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Mukies API",
        Version = "v1"
    });

    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Insira o token JWT neste formato: Bearer {seu_token}"
    };

    options.AddSecurityDefinition("Bearer", securityScheme);

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            securityScheme,
            Array.Empty<string>()
        }
    });
});

// 6. Habilitar CORS para o React (Vite)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        var origins = new[] { "http://localhost:5173", "http://127.0.0.1:5173" }
            .Concat((builder.Configuration["Cors:AllowedOrigins"] ?? string.Empty)
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray();

        policy.WithOrigins(origins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await dbContext.Database.MigrateAsync();
    await InitialAdminInitializer.InitializeAsync(scope.ServiceProvider, app.Configuration);
}

// 7. Middleware Global de Exceções
app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReact");
app.UseHttpsRedirection();

// 8. Middlewares de Autenticação e Autorização
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapGet("/health", () => Results.Ok(new { status = "ok" })).AllowAnonymous();

app.Run();

static Dictionary<string, string?> LoadDotEnv(string path)
{
    var values = new Dictionary<string, string?>(StringComparer.OrdinalIgnoreCase);

    if (!File.Exists(path))
        return values;

    foreach (var line in File.ReadLines(path))
    {
        var trimmed = line.Trim();
        if (string.IsNullOrWhiteSpace(trimmed) || trimmed.StartsWith('#'))
            continue;

        if (trimmed.StartsWith("export ", StringComparison.OrdinalIgnoreCase))
            trimmed = trimmed[7..].TrimStart();

        var separator = trimmed.IndexOf('=');
        if (separator <= 0)
            continue;

        var key = trimmed[..separator].Trim().Replace("__", ":");
        var value = trimmed[(separator + 1)..].Trim().Trim('"', '\'');
        values[key] = value;
    }

    return values;
}

static string NormalizePostgreSqlConnectionString(string value)
{
    if (!Uri.TryCreate(value, UriKind.Absolute, out var uri) ||
        (uri.Scheme != "postgres" && uri.Scheme != "postgresql"))
    {
        return value;
    }

    var userInfo = uri.UserInfo.Split(':', 2);
    var builder = new NpgsqlConnectionStringBuilder
    {
        Host = uri.Host,
        Port = uri.IsDefaultPort ? 5432 : uri.Port,
        Database = uri.AbsolutePath.Trim('/'),
        Username = Uri.UnescapeDataString(userInfo[0]),
        Password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : string.Empty,
        SslMode = SslMode.Require,
        TrustServerCertificate = true
    };

    return builder.ConnectionString;
}
