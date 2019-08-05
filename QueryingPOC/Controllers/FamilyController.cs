using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using QueryingPOC.Infrastructure;
using QueryingPOC.Models;
using static QueryingPOC.Infrastructure.DataMock;

namespace QueryingPOC.Controllers
{

    [Route("[controller]")]
    [Controller]
    public class FamilyController : ControllerBase
    {
        [HttpGet]
        public IEnumerable<Person> GetRandom50Persons() 
            => ((List<Person>) Persons.Shuffle()).Take(50);
    }
}