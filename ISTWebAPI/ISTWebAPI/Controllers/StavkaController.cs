using ISTWebAPI.Filters;
using ISTWebAPI.Models;
using static ISTWebAPI.Validation.Validation;
using ISTWebAPI.Wrappers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace ISTWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StavkaController : ControllerBase
    {
        private readonly ILogger<StavkaController> logger;
        
        public StavkaController(ILogger<StavkaController> logger)
        {
            this.logger = logger;
        }

        [HttpGet("get/all")]
        public IActionResult getAll()
        {
            var linq = Stavka.stavke.OrderBy(s => s.name).ThenBy(s => s.pricePerUnit).ToList();

            if (linq != null)
            {
                return Ok(new Response<List<Stavka>>(linq));
            }

            return NotFound("Lista stavki nije popunjena.");
        }

        [HttpGet("get")]
        public IActionResult getAll([FromQuery] PaginationFilter filter)
        {
            var linq = Stavka.stavke.OrderBy(s => s.name).ThenBy(s => s.pricePerUnit).ToList();
            var vFilter = new PaginationFilter(filter.PageNumber, filter.PageSize);
            var paged = linq.Skip((vFilter.PageNumber - 1) * vFilter.PageSize).Take(vFilter.PageSize).ToList();

            if (paged != null)
            {
                return Ok(new PagedResponse<List<Stavka>>(paged, vFilter.PageNumber, vFilter.PageSize));
            }

            return NotFound("Lista stavki nije popunjena.");
        }

        [HttpGet("get/{id}")]
        public IActionResult getStavka(int id)
        {
            var linq = Stavka.stavke.FirstOrDefault(s => s.id == id);

            if (linq == null)
            {
                return NotFound("Ne postoji stavka sa ovakvim identifikatorom.");
            }
            else
            {
                return Ok(new Response<Stavka>(linq));
            }
        }

        [HttpPost("add")]
        public IActionResult postStavka([FromBody] Stavka stavka)
        {
            if (ModelState.IsValid)
            {
                if (validateStavka(stavka))
                {
                    int id = 0;
                    if (Stavka.stavke.Count != 0)
                    {
                        id = Stavka.stavke.OrderByDescending(p => p.id).First().id + 1;
                    }

                    stavka.id = id;

                    Stavka.stavke.Add(stavka);
                    logger.Log(LogLevel.Information, "Dodata nova stavka sa ID: " + stavka.id);
                    return Ok(new Response<Stavka>(stavka));
                }
                else
                {
                    return BadRequest(ModelState);
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }

        [HttpPut("edit")]
        public IActionResult putStavka([FromBody] Stavka stavka)
        {
            var s = Stavka.stavke.FirstOrDefault(s => s.id == stavka.id);

            if (Stavka.stavke.Count > 0)
            {
                if (s != null)
                {
                    if (ModelState.IsValid)
                    {
                        s.name = stavka.name;
                        s.pricePerUnit = stavka.pricePerUnit;
                        s.unitOfMeasurement = stavka.unitOfMeasurement;
                        s.amount = stavka.amount;

                        return Ok(new Response<Stavka>(s));
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
        public IActionResult deleteStavka(int id)
        {
            var linq = Stavka.stavke.FirstOrDefault(s => s.id == id);

            if (linq == null)
            {
                return NotFound();
            }
            else
            {
                if (Stavka.stavke.Remove(linq))
                {
                    return Ok(new Response<Stavka>(linq));
                }
                else
                {
                    return Problem();
                }
            }
        }
    }
}
