using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using InventheReact.Models;

namespace InventheReact.Controllers
{
    //[Authorize]
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
        public IEnumerable<Products> Get()
        {
            return _context.Products.ToList();
        }
    }
}
