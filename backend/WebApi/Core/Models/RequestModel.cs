using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Models
{
    public class RequestModel
    {
        public Guid EventId { get; set; }
        public int quantity { get; set; }
    }
}
