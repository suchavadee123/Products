using MediatR;
using Microsoft.EntityFrameworkCore;
using products.Server.Data;
using ProductModel = products.Server.Models.Product;

namespace products.Server.Services.Product;

public class List : IRequest<List<ProductModel>>
{
}

public class ListHandler : IRequestHandler<List, List<ProductModel>>
{
    private readonly ApplicationDbContext _context;

    public ListHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProductModel>> Handle(List request, CancellationToken cancellationToken)
    {
        return await _context.Products.ToListAsync(cancellationToken);
    }
}

