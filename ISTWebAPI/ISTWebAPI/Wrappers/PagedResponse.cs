using ISTWebAPI.Filters;
using ISTWebAPI.Services;
using Microsoft.AspNetCore.Routing;

namespace ISTWebAPI.Wrappers
{
    public class PagedResponse<T> : Response<T>
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public Uri FirstPage { get; set; }
        public Uri LastPage { get; set; }
        public int TotalPages { get; set; }
        public int TotalRecords { get; set; }
        public Uri NextPage { get; set; }
        public Uri PreviousPage { get; set; }
        public PagedResponse(T data, int pageNumber, int pageSize)
        {
            this.PageNumber = pageNumber;
            this.PageSize = pageSize;
            this.Data = data;
            this.Message = null;
            this.Succeeded = true;
            this.Errors = null;
        }

        public PagedResponse(T data, int pageNumber, int pageSize, int totalPages, int totalRecords)
        {
            this.PageNumber = pageNumber;
            this.PageSize = pageSize;
            this.TotalPages = totalPages;
            this.TotalRecords = totalRecords;
            this.Data = data;
            this.Message = null;
            this.Succeeded = true;
            this.Errors = null;
        }
        public PagedResponse(T data, int pageNumber, int pageSize, int totalPages, int totalRecords, IUriService uriService, string route)
        {
            this.PageNumber = pageNumber;
            this.PageSize = pageSize;
            this.TotalPages = totalPages;
            this.TotalRecords = totalRecords;
            this.FirstPage = uriService.GetPageURI(new PaginationFilter(1, pageSize), route);
            this.NextPage = uriService.GetPageURI(new PaginationFilter(pageNumber + 1, pageSize), route);
            this.PreviousPage = uriService.GetPageURI(new PaginationFilter(pageNumber - 1, pageSize), route);
            this.LastPage = uriService.GetPageURI(new PaginationFilter(totalPages, pageSize), route);
            this.Data = data;
            this.Message = null;
            this.Succeeded = true;
            this.Errors = null;
        }
    }
}
