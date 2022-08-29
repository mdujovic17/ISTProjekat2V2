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
        private static List<Preduzece> preduzeca = new List<Preduzece>() 
        {
            //new Preduzece { id=0, name="Marko", lastName="Dujovic", phoneNumber="+381612606668", email="markonrt8519@gs.viser.edu.rs", companyAddress="Vojvode Novaka 11. deo 7D", companyName="Preduzece 1", vat="RS-TE123456789"},
            //new Preduzece { id=1, name="Marko", lastName="Dujovic", phoneNumber="+381612606668", email="markonrt8519@gs.viser.edu.rs", companyAddress="Vojvode Novaka 1. deo 5D", companyName="Preduzece 2", vat="RS-TE123456788"},
            //new Preduzece { id=2, name="Marko", lastName="Dujovic", phoneNumber="+381612606668", email="markonrt8519@gs.viser.edu.rs", companyAddress="Vojvode Novaka 21. deo 6D", companyName="Preduzece 3", vat="RS-TE123456787"},
            //new Preduzece { id=3, name="Marko", lastName="Dujovic", phoneNumber="+381612606668", email="markonrt8519@gs.viser.edu.rs", companyAddress="Vojvode Novaka 13. deo 5D", companyName="Preduzece 4", vat="RS-TE123456786"},
            //new Preduzece { id=4, name="Marko", lastName="Dujovic", phoneNumber="+381612606668", email="markonrt8519@gs.viser.edu.rs", companyAddress="Vojvode Novaka 41. deo 1D", companyName="Preduzece 5", vat="RS-TE123456785"},
            //new Preduzece { id=5, name="Marko", lastName="Dujovic", phoneNumber="+381612606668", email="markonrt8519@gs.viser.edu.rs", companyAddress="Vojvode Novaka 16. deo 3D", companyName="Preduzece 6", vat="RS-TE123456784"},
            //new Preduzece { id=6, name="Marko", lastName="Dujovic", phoneNumber="+381612606668", email="markonrt8519@gs.viser.edu.rs", companyAddress="Vojvode Novaka 13. deo 5D", companyName="Preduzece 7", vat="RS-TE123456783"},
            //new Preduzece { id=7, name="Marko", lastName="Dujovic", phoneNumber="+381612606668", email="markonrt8519@gs.viser.edu.rs", companyAddress="Vojvode Novaka 14. deo 35D", companyName="Preduzece 8", vat="RS-TE123456782"},
            //new Preduzece { id=8, name="Marko", lastName="Dujovic", phoneNumber="+381612606668", email="markonrt8519@gs.viser.edu.rs", companyAddress="Vojvode Novaka 71. deo 5D", companyName="Preduzece 9", vat="RS-TE123456781"},
            //new Preduzece { id=9, name="Marko", lastName="Dujovic", phoneNumber="+381612606668", email="markonrt8519@gs.viser.edu.rs", companyAddress="Vojvode Novaka 15. deo 9D", companyName="Preduzece 10", vat="RS-TE123456780"},
            //new Preduzece { id=10, name="Marko", lastName="Dujovic", phoneNumber="+381612606668", email="markonrt8519@gs.viser.edu.rs", companyAddress="Vojvode Novaka 91. deo 6D", companyName="Preduzece 11", vat="RS-TE123456799"},
            //new Preduzece { id=11, name="Marko", lastName="Dujovic", phoneNumber="+381612606668", email="markonrt8519@gs.viser.edu.rs", companyAddress="Vojvode Novaka 5. deo 1D", companyName="Preduzece 12", vat="RS-TE123456779"},
            //new Preduzece { id=12, name="Marko", lastName="Dujovic", phoneNumber="+381612606668", email="markonrt8519@gs.viser.edu.rs", companyAddress="Vojvode Novaka 17. deo 2D", companyName="Preduzece 13", vat="RS-TE000000000"}
        };

        private readonly ILogger<PreduzeceController>logger;

        public PreduzeceController(ILogger<PreduzeceController> logger) {
            this.logger = logger;
        }

        [HttpGet("get/preduzece/all")]
        public IActionResult getAll()
        {
            var linq = preduzeca.OrderBy(p => p.vat).ThenBy(p => p.companyName).ToList();

            if (linq != null)
            {
                return Ok(new Response<List<Preduzece>>(linq));
            }

            return NotFound("Lista preduzeca nije popunjena.");
        }

        [HttpGet("get/preduzece")]
        public IActionResult getAll([FromQuery] PaginationFilter filter)
        {
            var linq = preduzeca.OrderBy(p => p.vat).ThenBy(p => p.companyName);
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
            var lint = preduzeca.FirstOrDefault(p => p.id == id);

            if (lint == null)
            {
                return NotFound("Ne postoji preduzece sa ovakvim identifikatorom.");
            }
            else
            {
                return Ok(new Response<Preduzece>(lint));
            }
        }

        [HttpPost("add/preduzece")]
        public IActionResult postPreduzece([FromBody] Preduzece preduzece)
        {
            if (ModelState.IsValid)
            {
                if (preduzeca.Any(p => p.vat == preduzece.vat))
                {
                    return BadRequest("Preduzece sa ovim PIBom vec postoji!");
                }
                if (validatePreduzece(preduzece))
                {
                    int id = 0;
                    if (preduzeca.Count != 0)
                    {
                        id = preduzeca.OrderByDescending(p => p.id).First().id + 1;
                    }

                    preduzece.id = id;

                    preduzeca.Add(preduzece);
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
            var p = preduzeca.FirstOrDefault(p => p.id == preduzece.id);

            if (preduzeca.Any(pred => pred.vat == p.vat && pred.id != p.id))
            {
                return BadRequest("Preduzece sa ovakvim PIBom vec postoji!");
            }

            if (preduzeca.Count > 0)
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
            var lint = preduzeca.FirstOrDefault(p => p.id == id);

            if (lint == null)
            {
                return NotFound();
            }
            else
            {
                if (preduzeca.Remove(lint))
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
