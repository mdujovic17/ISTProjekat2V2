using ISTWebAPI.Filters;

namespace ISTWebAPI.Services
{
    public interface IUriService
    {
        public Uri GetPageURI(PaginationFilter filter, string route);
    }
}