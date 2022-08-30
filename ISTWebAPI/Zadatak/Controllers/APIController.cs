using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Zadatak.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class APIController : ControllerBase
    {
        [HttpGet]
        public IActionResult velikaSlova([FromQuery] string rec)
        {
            if (rec == null || rec == "")
            {
                return BadRequest();
            }
            string velikaSlova = rec.ToUpper();
            return Ok(velikaSlova);
        }

        [HttpPost("{n}")]
        public IActionResult suma(int n)
        {
            int Suma = 0;
            for (int i = 0; i < n; i++)
            {
                Suma += i;
            }

            return Ok(Suma);
        }
    }
}
