#nullable enable
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using InventheReact.Models;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using InventheReact.Data.DataTransfer;
using System.Net.Mime;
using Microsoft.AspNetCore.Http;
using System;

namespace InventheReact.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly ProductsContext _context;
        private readonly ILogger<ProductsController> _logger;

        public ProductsController(ProductsContext context, ILogger<ProductsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public IActionResult GetAllProducts()
        {
            return Ok(_context.Products.ToList());
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetByIdAsync(Guid id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateAsync(Guid id, ProductsDTO updatedProduct)
        {
            if (updatedProduct is null || updatedProduct.Quantity < 0 || string.IsNullOrWhiteSpace(updatedProduct.Label))
            {
                return BadRequest();
            }

            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            product.Label = updatedProduct.Label;
            product.Quantity = updatedProduct.Quantity;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteAsync(Guid id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            _context.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateAsync([FromBody]ProductsDTO products)
        {
            if (products is null || products.Quantity < 0 || string.IsNullOrWhiteSpace(products.Label))
            {
                return BadRequest();
            }

            var createdProduct = new Products
            {
                Id = Guid.NewGuid(),
                Quantity = products.Quantity,
                Label = products.Label
            };

            await _context.AddAsync(createdProduct);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetByIdAsync), new { createdProduct.Id }, createdProduct);
        }
    }
}
