using ISTWebAPI.Models;
using static ISTWebAPI.Validation.Validation;
using ISTWebAPI.Wrappers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using ISTWebAPI.Filters;

namespace ISTWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PreduzeceController : ControllerBase
    {
        internal class Bilans
        {
            public float SumIn { get; internal set; }
            public float SumOut { get; internal set; }
            public float bilans { get; internal set; }
            public int In { get; internal set; }
            public int Out { get; internal set; }
        }

        private readonly ILogger<PreduzeceController>logger;

        public PreduzeceController(ILogger<PreduzeceController> logger) {
            this.logger = logger;
        }

        [HttpGet("get/preduzece/all")]
        public IActionResult getAll()
        {
            var linq = Preduzece.preduzeca.OrderBy(p => p.vat).ThenBy(p => p.companyName).ToList();

            if (linq != null)
            {
                return Ok(new Response<List<Preduzece>>(linq));
            }

            return NotFound("Lista preduzeca nije popunjena.");
        }

        [HttpGet("get/preduzece")]
        public IActionResult getAll([FromQuery] PaginationFilter filter)
        {
            var linq = Preduzece.preduzeca.OrderBy(p => p.vat).ThenBy(p => p.companyName);
            var vFilter = new PaginationFilter(filter.PageNumber, filter.PageSize);
            var pagedLinq = linq.Skip((vFilter.PageNumber - 1) * vFilter.PageSize).Take(vFilter.PageSize).ToList();

            if (pagedLinq != null)
            {
                return Ok(new PagedResponse<List<Preduzece>>(pagedLinq, vFilter.PageNumber, vFilter.PageSize));
            }
            return NotFound("Lista preduzeca nije popunjena.");
        }

        [HttpGet("get/preduzece/{id}")]
        public IActionResult getPreduzece(int id)
        {
            var lint = Preduzece.preduzeca.FirstOrDefault(p => p.id == id);

            if (lint == null)
            {
                return NotFound("Ne postoji preduzece sa ovakvim identifikatorom.");
            }
            else
            {
                return Ok(new Response<Preduzece>(lint));
            }
        }

        [HttpGet("bilans/{id}")]
        public IActionResult bilansPreduzeca(int id)
        {

            Preduzece p = Preduzece.preduzeca.FirstOrDefault(p => p.id == id);

            int ulazneFakture = 0, izlazneFakture = 0;
            float sumIn = 0, sumOut = 0;

            if (p != null)
            {
                foreach (Faktura f in Faktura.fakture)
                {
                    if (p.vat.Equals(f.originCompanyVAT) || p.vat.Equals(f.destinationCompanyVAT))
                    {
                        if (f.type)
                        {
                            ulazneFakture++;
                            sumIn += f.priceTotal;
                        }
                        else
                        {
                            izlazneFakture++;
                            sumOut = f.priceTotal;
                        }
                    }
                }

                Bilans bilans = new Bilans { In = ulazneFakture, Out = izlazneFakture, SumIn = sumIn, SumOut = sumOut, bilans=(sumIn-sumOut) };

                return Ok(new Response<Bilans>(bilans));
            }
            return Problem();
        }

        [HttpPost("add/preduzece")]
        public IActionResult postPreduzece([FromBody] Preduzece preduzece)
        {
            if (ModelState.IsValid)
            {
                if (Preduzece.preduzeca.Any(p => p.vat == preduzece.vat))
                {
                    return BadRequest("Preduzece sa ovim PIBom vec postoji!");
                }
                if (validatePreduzece(preduzece))
                {
                    int id = 0;
                    if (Preduzece.preduzeca.Count != 0)
                    {
                        id = Preduzece.preduzeca.OrderByDescending(p => p.id).First().id + 1;
                    }

                    preduzece.id = id;

                    Preduzece.preduzeca.Add(preduzece);
                    logger.Log(LogLevel.Information, "Dodato novo preduzece sa ID: " + preduzece.id);
                    return Ok(new Response<Preduzece>(preduzece));
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

        [HttpPut("edit/preduzece")]
        public IActionResult putPreduzece([FromBody] Preduzece preduzece)
        {
            var p = Preduzece.preduzeca.FirstOrDefault(p => p.id == preduzece.id);

            if (Preduzece.preduzeca.Any(pred => pred.vat == p.vat && pred.id != p.id))
            {
                return BadRequest("Preduzece sa ovakvim PIBom vec postoji!");
            }

            if (Preduzece.preduzeca.Count > 0)
            {
                if (p != null)
                {
                    if (ModelState.IsValid)
                    {
                        p.name = preduzece.name;
                        p.lastName = preduzece.lastName;
                        p.phoneNumber = preduzece.phoneNumber;
                        p.email = preduzece.email;
                        p.companyName = preduzece.companyName;
                        p.companyAddress = preduzece.companyAddress;
                        p.vat = preduzece.vat;

                        return Ok(new Response<Preduzece>(p));
                    }
                    else
                    {
                        return BadRequest(ModelState);
                    }
                }
                return Problem("Lista preduzeca je prazna!");
            }
            return Problem("Nepoznata greska");
        }

        [HttpDelete("delete/preduzece/{id}")]
        public IActionResult deletePreduzece(int id)
        {
            var lint = Preduzece.preduzeca.FirstOrDefault(p => p.id == id);

            if (lint == null)
            {
                return NotFound();
            }
            else
            {
                if (Preduzece.preduzeca.Remove(lint))
                {
                    return Ok(new Response<Preduzece>(lint));
                }
                else
                {
                    return Problem();
                }
            }
        }
    }

    
}
