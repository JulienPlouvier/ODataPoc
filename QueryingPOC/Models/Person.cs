using System;
using System.Collections.Generic;

namespace QueryingPOC.Models
{
    public class Person
    {
        public Guid Id { get; set; }
        public FamilyName Family { get; set; }
        public List<Address> Addresses { get; set; }
        public string Surname { get; set; }
        public string Name { get; set; }
        public DateTime Birth { get; set; }
    }
}