using MediatR;
using Microsoft.AspNetCore.Mvc;
using products.Server.Models;
using products.Server.Services.Product;

namespace products.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<List<Product>>> Get()
    {
        var products = await _mediator.Send(new List());
        return Ok(products);
    }

    [HttpPost]
    public async Task<ActionResult<Product>> Post([FromBody] Create request)
    {
        var product = await _mediator.Send(request);
        return CreatedAtAction(nameof(Get), new { id = product.Id }, product);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(long id)
    {
        var deleted = await _mediator.Send(new Delete { Id = id });
        
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}

