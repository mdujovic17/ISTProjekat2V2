using System.ComponentModel.DataAnnotations;

namespace ISTWebAPI.Models
{
    public class Preduzece
    {
        [Required]
        public int id { get; set; }
        [Required]
        public string name { get; set; }
        [Required]
        public string lastName { get; set; }
        [Required]
        public string phoneNumber { get; set; }
        [Required]
        public string email { get; set; }
        [Required]
        public string companyAddress { get; set; }
        [Required]
        public string companyName { get; set; }
        [Required]
        public string vat { get; set; }
    }
}
