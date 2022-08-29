namespace ISTWebAPI.Wrappers
{
    public class SearchResponse<T> : PagedResponse<T>
    {
        public string CompanyName { get; set; }
        public string VAT { get; set; }
        public SearchResponse(T data, int pageNumber, int pageSize, string companyName, string VAT) : base(data, pageNumber, pageSize)
        {
            this.CompanyName = companyName;
            this.VAT = VAT;
        }
    }
}
