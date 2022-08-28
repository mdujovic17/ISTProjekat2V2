namespace ISTWebAPI.Models
{
    public class Faktura
    {
        public int id { get; set; }
        public string destinationCompanyVAT { get; set; }
        public string originCompanyVAT { get; set; }
        public DateOnly dateOfCreating { get; set; }
        public DateOnly paymentDeadline { get; set; }
        public List<Stavka> items { get; set; }
        public float priceTotal { get; set; }
        public bool type { get; set; }
    }
}
