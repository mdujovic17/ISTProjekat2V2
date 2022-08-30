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
        //private static List<Faktura> fakture = new List<Faktura>() { };

        private ILogger<FakturaController> logger;

        public FakturaController(ILogger<FakturaController> logger)
        {
            this.logger = logger;
        }

        [HttpGet("get/all")]
        public IActionResult getAll()
        {
            var linq = Faktura.fakture.OrderBy(f => f.originCompanyVAT).ThenBy(f => f.destinationCompanyVAT).ToList();

            if (linq != null)
            {
                return Ok(new Response<List<Faktura>>(linq));
            }

            return NotFound("Lista faktura nije popunjena");
        }

        [HttpGet("get/byId/{id}")]
        public IActionResult getFaktura(int id)
        {
            var lint = Faktura.fakture.FirstOrDefault(p => p.id == id);

            if (lint == null)
            {
                return NotFound("Ne postoji faktura sa ovakvim identifikatorom.");
            }
            else
            {
                return Ok(new Response<Faktura>(lint));
            }
        }

        [HttpGet("get/{companyVAT}")]
        public IActionResult getAll(string companyVAT, [FromQuery] PaginationFilter filter)
        {
            var linq = Faktura.fakture.Where(f => f.originCompanyVAT == companyVAT || f.destinationCompanyVAT == companyVAT).OrderBy(f => f.originCompanyVAT).ThenBy(f => f.destinationCompanyVAT).ToList();
            var vFilter = new PaginationFilter(filter.PageNumber, filter.PageSize);
            var paged = linq.Skip((vFilter.PageNumber - 1) * vFilter.PageSize).Take(vFilter.PageSize).ToList();
            
            var totalRecords = Preduzece.preduzeca.Count();
            var totalPages = Convert.ToInt32(Math.Ceiling(((double)totalRecords / (double)vFilter.PageSize)));

            if (paged != null)
            {
                return Ok(new PagedResponse<List<Faktura>>(paged, vFilter.PageNumber, vFilter.PageSize, totalPages, totalRecords));
            }

            return NotFound("Lista stavki nije popunjena.");
        }

        [HttpGet("search/{companyVAT}")]
        public IActionResult search(string companyVAT, [FromQuery] float total, [FromQuery] string itemName, [FromQuery] PaginationFilter filter)
        {
            var fakture = Faktura.fakture.Where(f => f.originCompanyVAT == companyVAT || f.destinationCompanyVAT == companyVAT).OrderBy(f => f.originCompanyVAT).ThenBy(f => f.destinationCompanyVAT).ToList();
            var linq = fakture.Where(f => f.items.Any(it => Stavka.stavke.Any(s => s.id == it && s.name.Equals(itemName))) || f.priceTotal == total).ToList();
            var vFilter = new PaginationFilter(filter.PageNumber, filter.PageSize);
            var paged = linq.Skip((vFilter.PageNumber - 1) * vFilter.PageSize).Take(vFilter.PageSize).ToList();

            var totalRecords = Preduzece.preduzeca.Count();
            var totalPages = Convert.ToInt32(Math.Ceiling(((double)totalRecords / (double)vFilter.PageSize)));

            if (paged != null)
            {
                return Ok(new PagedResponse<List<Faktura>>(paged, vFilter.PageNumber, vFilter.PageSize, totalPages, totalRecords));
            }
            return Problem();
        }

        [HttpPost("add")]
        public IActionResult postFaktura([FromBody] Faktura faktura)
        {
            if (ModelState.IsValid)
            {
                int id = 0;
                if (Faktura.fakture.Count != 0)
                {
                    id = Faktura.fakture.OrderByDescending(f => f.id).First().id + 1;
                }
                float sum = 0;

                List<Stavka> stavke = new List<Stavka>();

                for (int i = 0; i < faktura.items.Count; i++)
                {
                    stavke.Add(Stavka.stavke.FirstOrDefault(s => s.id == faktura.items[i]));
                }

                foreach (Stavka s in stavke)
                {
                    sum += s.pricePerUnit * s.amount;
                }

                faktura.id = id;
                faktura.priceTotal = sum;

                Faktura.fakture.Add(faktura);
                logger.Log(LogLevel.Information, "Dodata nova faktura sa ID: " + faktura.id);
                return Ok(new Response<Faktura>(faktura));
            }
            else
            {
                return BadRequest(ModelState);
            }
        }

        [HttpPut("edit")]
        public IActionResult putFaktura([FromBody] Faktura faktura)
        {
            var f = Faktura.fakture.FirstOrDefault(f => f.id == faktura.id);

            if (Faktura.fakture.Count > 0)
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

        [HttpDelete("delete/{id}")]
        public IActionResult deleteFaktura(int id)
        {
            var linq = Faktura.fakture.FirstOrDefault(f => f.id == id);

            if (linq == null)
            {
                return NotFound();
            }
            else
            {
                if (Faktura.fakture.Remove(linq))
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
