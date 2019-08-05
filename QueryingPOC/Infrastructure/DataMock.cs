using System;
using System.Collections.Generic;
using QueryingPOC.Models;

namespace QueryingPOC.Infrastructure
{
    public static class DataMock
    {
        public static List<Person> Persons { get; set; }
        public static List<Family> Families { get; set; }


        public static void InitData()
        {
            Families = new List<Family>();
            Persons = new List<Person>();

            var charles = new Person
            {
                Family = FamilyName.Charles,
                Birth = new DateTime(1924, 5, 15),
                Name = "Charles",
                Surname = "Xavier",
                Addresses = new List<Address>()
                {
                    new Address
                {
                    City = "Paris",
                    Country = "France",
                    Number = 2,
                    PostalCode = 75000,
                    Street = "des Champs Elysée",
                    StreetType = StreetType.Avenue
                },
                new Address
                {
                    City = "New York",
                    Country = "USA",
                    Number = 5,
                    PostalCode = 5200,
                    Street = "Houston",
                    StreetType = StreetType.Street
 }               }
            };
            var henry = new Person
            {
                Family = FamilyName.Henry,
                Birth = new DateTime(1945, 5, 20),
                Name = "Henry",
                Surname = "Olet",
                Addresses = new List<Address>()
                {
                        new Address
                    {
                        City = "Paris",
                        Country = "France",
                        Number = 5,
                        PostalCode = 75000,
                        Street = "des Etats Unis",
                        StreetType = StreetType.Boulevard
                    },
                    new Address
                    {
                        City = "Miami",
                        Country = "USA",
                        Number = 1562,
                        PostalCode = 5250,
                        Street = "Grand Casino",
                        StreetType = StreetType.Avenue
                    }
                }
            };
            var paul = new Person
            {
                Family = FamilyName.Paul,
                Birth = new DateTime(1978, 11, 2),
                Name = "Paul",
                Surname = "Paul",
                Addresses = new List<Address>()
                {
                         new Address
                    {
                        City = "Marseilles",
                        Country = "France",
                        Number = 8,
                        PostalCode = 16220,
                        Street = "de la Canebière",
                        StreetType = StreetType.Avenue
                    },
                    new Address
                    {
                        City = "Los Angeles",
                        Country = "USA",
                        Number = 15620,
                        PostalCode = 5250,
                        Street = "Sea Side",
                        StreetType = StreetType.Road
                    }
                }
            };

            Families.Add(new Family(charles));

            Families.Add(new Family(henry));

            Families.Add(new Family(paul));

            using (var parser = new CsvParser())
                parser.Import();

            Persons.Add(charles);
            Persons.Add(henry);
            Persons.Add(paul);
        }

    }
}
