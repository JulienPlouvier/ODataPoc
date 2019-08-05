using System;

namespace QueryingPOC.Models
{
    public class Address
    {
        public int Number { get; set; }
        public int PostalCode { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public StreetType StreetType { get; set; }
        public string Country { get; set; }
    }

    public enum StreetType
    {
        Street,
        Road, 
        Avenue, 
        Boulevard, 
        DeadEnd,
    }
}