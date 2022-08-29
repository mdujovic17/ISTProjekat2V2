namespace ISTWebAPI.Filters
{
    public class SearchFilter
    {
        public string companyName { get; set; }
        public string VAT { get; set; }

        public SearchFilter()
        {
            companyName = "";
            VAT = "";
        }

        public SearchFilter(string companyName, string VAT)
        {
            this.companyName = companyName;
            this.VAT = VAT;
        }
    }
}
