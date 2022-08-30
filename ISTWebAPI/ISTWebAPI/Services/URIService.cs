using ISTWebAPI.Filters;
using Microsoft.AspNetCore.WebUtilities;

namespace ISTWebAPI.Services
{
    public class URIService : IUriService
    {
        private readonly string BaseURI;

        public URIService(string baseURI)
        {
            BaseURI = baseURI;
        }

        public Uri GetPageURI(PaginationFilter filter, string route)
        {
            Uri EndpointURI = new Uri(string.Concat(BaseURI, route));
            string modifiedUri = QueryHelpers.AddQueryString(EndpointURI.ToString(), "pageNumber", filter.PageNumber.ToString());
            modifiedUri = QueryHelpers.AddQueryString(modifiedUri, "pageSize", filter.PageSize.ToString());

            return new Uri(modifiedUri);
        }
    }
}
