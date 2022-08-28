using ISTWebAPI.Filters;
using ISTWebAPI.Models;
using ISTWebAPI.Wrappers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ISTWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FakturaController : ControllerBase
    {
        private static List<Faktura> fakture = new List<Faktura>() { };

        private ILogger<FakturaController> logger;

        public FakturaController(ILogger<FakturaController> logger)
        {
            this.logger = logger;
        }

        [HttpGet("get/faktura/all")]
        public IActionResult getAll()
        {
            var linq = fakture.OrderBy(f => f.originCompanyVAT).ThenBy(f => f.destinationCompanyVAT).ToList();

            if (linq != null)
            {
                return Ok(new Response<List<Faktura>>(linq));
            }

            return NotFound("Lista faktura nije popunjena");
        }

        [HttpGet("get/faktura/{companyVAT}")]
        public IActionResult getAll(string companyVAT, [FromQuery] PaginationFilter filter)
        {
            var linq = fakture.Where(f => f.originCompanyVAT == companyVAT || f.destinationCompanyVAT == companyVAT).OrderBy(f => f.originCompanyVAT).ThenBy(f => f.destinationCompanyVAT).ToList();
            var vFilter = new PaginationFilter(filter.PageNumber, filter.PageSize);
            var paged = linq.Skip((vFilter.PageNumber - 1) * vFilter.PageSize).Take(vFilter.PageSize).ToList(); 

            if (paged != null)
            {
                return Ok(new PagedResponse<List<Faktura>>(paged, vFilter.PageNumber, vFilter.PageSize));
            }

            return NotFound("Lista stavki nije popunjena.");
        }

        [HttpPost("add/faktura")]
        public IActionResult postFaktura([FromBody] Faktura faktura)
        {
            if (ModelState.IsValid)
            {
                int id = 0;
                if (fakture.Count != 0)
                {
                    id = fakture.OrderByDescending(f => f.id).First().id + 1;
                }

                faktura.id = id;

                fakture.Add(faktura);
                logger.Log(LogLevel.Information, "Dodata nova faktura sa ID: " + faktura.id);
                return Ok(new Response<Faktura>(faktura));
            }
            else
            {
                return BadRequest(ModelState);
            }
        }

        [HttpPut("edit/stavka")]
        public IActionResult putFaktura([FromBody] Faktura faktura)
        {
            var f = fakture.FirstOrDefault(f => f.id == faktura.id);

            if (fakture.Count > 0)
            {
                if (f != null)
                {
                    if (ModelState.IsValid)
                    {
                        f.destinationCompanyVAT = faktura.destinationCompanyVAT;
                        f.originCompanyVAT = faktura.originCompanyVAT;
                        f.dateOfCreating = faktura.dateOfCreating;
                        f.paymentDeadline = faktura.paymentDeadline;
                        f.items = faktura.items;
                        f.priceTotal = faktura.priceTotal;
                        f.type = faktura.type;

                        return Ok(new Response<Faktura>(f));
                    }
                    else
                    {
                        return BadRequest(ModelState);
                    }
                }
                return Problem();
            }
            return Problem();
        }

        [HttpDelete("delete/faktura/{id}")]
        public IActionResult deleteFaktura(int id)
        {
            var linq = fakture.FirstOrDefault(f => f.id == id);

            if (linq == null)
            {
                return NotFound();
            }
            else
            {
                if (fakture.Remove(linq))
                {
                    return Ok(new Response<Faktura>(linq));
                }
                else
                {
                    return Problem();
                }
            }
        }
    }
}
