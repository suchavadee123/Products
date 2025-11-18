using MediatR;
using products.Server.Data;
using ProductModel = products.Server.Models.Product;

namespace products.Server.Services.Product;

public class Create : IRequest<ProductModel>
{
    public required string ProductCode { get; set; }
    public required string ProductCodeClean { get; set; }
    public required string BarcodeType { get; set; }
}

public class CreateHandler : IRequestHandler<Create, ProductModel>
{
    private readonly ApplicationDbContext _context;

    public CreateHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ProductModel> Handle(Create request, CancellationToken cancellationToken)
    {
        var codeClean = request.ProductCodeClean ?? request.ProductCode?.Replace("-", "");
        
        if (string.IsNullOrWhiteSpace(codeClean))
        {
            throw new ArgumentException("Code is required");
        }

        codeClean = codeClean.ToUpper();
        var codePattern = new System.Text.RegularExpressions.Regex(@"^[A-Z0-9]{16}$");
        var formattedPattern = new System.Text.RegularExpressions.Regex(@"^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$");
        
        if (!codePattern.IsMatch(codeClean))
        {
            if (codeClean.Length != 16)
            {
                throw new ArgumentException($"Code must be exactly 16 characters. Current length: {codeClean.Length}");
            }
            
            if (!System.Text.RegularExpressions.Regex.IsMatch(codeClean, @"^[A-Z0-9]+$"))
            {
                throw new ArgumentException("Code must contain only uppercase letters and numbers");
            }
            
            throw new ArgumentException("Invalid code format");
        }

        string formattedCode;
        if (!string.IsNullOrWhiteSpace(request.ProductCode) && formattedPattern.IsMatch(request.ProductCode.ToUpper()))
        {
            formattedCode = request.ProductCode.ToUpper();
        }
        else
        {
            formattedCode = $"{codeClean.Substring(0, 4)}-{codeClean.Substring(4, 4)}-{codeClean.Substring(8, 4)}-{codeClean.Substring(12, 4)}";
        }

        var product = new ProductModel
        {
            ProductCode = formattedCode,
            ProductCodeClean = codeClean,
            BarcodeType = request.BarcodeType?.ToUpper() ?? "CODE39",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync(cancellationToken);

        return product;
    }
}

