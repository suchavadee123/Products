using MediatR;
using products.Server.Data;

namespace products.Server.Services.Product;

public class Delete : IRequest<bool>
{
    public long Id { get; set; }
}

public class DeleteHandler : IRequestHandler<Delete, bool>
{
    private readonly ApplicationDbContext _context;

    public DeleteHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(Delete request, CancellationToken cancellationToken)
    {
        var product = await _context.Products.FindAsync(new object[] { request.Id }, cancellationToken);
        
        if (product == null)
        {
            return false;
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}

