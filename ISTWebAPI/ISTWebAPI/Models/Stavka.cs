using System.ComponentModel.DataAnnotations;

namespace ISTWebAPI.Models
{
    public class Stavka
    {
        [Required]
        public int id { get; set; }
        [Required]
        public string name { get; set; }
        [Range(1.000, 10000000.000)]
        public float pricePerUnit { get; set; }
        [Required]
        public string unitOfMeasurement { get; set; }
        [Range(0.000, 100000.000)]
        public float amount { get; set; }
    }
}
