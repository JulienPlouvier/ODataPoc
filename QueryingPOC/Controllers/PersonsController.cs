using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Routing;
using Microsoft.AspNetCore.Mvc;
using QueryingPOC.Infrastructure;
using QueryingPOC.Models;

namespace QueryingPOC.Controllers
{
    public class PersonsController : ODataController
    {
        [ODataRoute]
        [EnableQuery]
        public IEnumerable<Person> Get()
        {
            return ((List<Person>)DataMock.Persons.Shuffle()).Take(50);
        }
    }
}
