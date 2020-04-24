#nullable enable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventheReact.Data.DataTransfer
{
    public class ProductsDTO
    {
        public double Quantity { get; set; }
        public string Label { get; set; } = string.Empty;
    }
}
