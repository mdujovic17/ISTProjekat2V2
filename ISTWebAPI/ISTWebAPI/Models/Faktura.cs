namespace ISTWebAPI.Models
{
    public class Faktura
    {
        public static List<Faktura> fakture = new List<Faktura>() { };

        public int id { get; set; }
        public string destinationCompanyVAT { get; set; }
        public string originCompanyVAT { get; set; }
        public DateTime dateOfCreating { get; set; }
        public DateTime paymentDeadline { get; set; }
        public List<Stavka> items { get; set; }
        public float priceTotal { get; set; }
        public bool type { get; set; }
    }
}
