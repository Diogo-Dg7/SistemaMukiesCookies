using System.ComponentModel.DataAnnotations;

namespace Mukies.Services.DTOs;

public class CookieDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}

public class CreateCookieDto
{
    [Required(ErrorMessage = "O nome do cookie é obrigatório.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "O nome deve ter entre 3 e 100 caracteres.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "A descrição é obrigatória.")]
    [StringLength(500, ErrorMessage = "A descrição não pode exceder 500 caracteres.")]
    public string Description { get; set; } = string.Empty;

    [Range(0.01, 10000.00, ErrorMessage = "O preço deve ser maior que zero.")]
    public decimal Price { get; set; }

    [Url(ErrorMessage = "A URL da imagem deve ser válida.")]
    public string ImageUrl { get; set; } = string.Empty;
}