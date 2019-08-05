using System;
using System.Collections.Generic;

namespace QueryingPOC.Models
{
    public enum FamilyName { Paul, Charles, Henry}

    public class Family
    {
        public Guid Id { get; set; }
        public List<Person> Members { get; set; }
        public Person Founder { get; set; }
        public FamilyName Name { get; set; }

        public Family(Person founder)
        {
            Members = new List<Person>();
            Founder = founder;
            Name = founder.Family;
            Id = Guid.NewGuid();
        }
    }
}
