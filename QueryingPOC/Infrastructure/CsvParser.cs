using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using CsvHelper;
using CsvHelper.Configuration;
using QueryingPOC.Models;

namespace QueryingPOC.Infrastructure
{
    public class CsvParser : IDisposable
    {
        public CsvParser()
        {
        }

        private List<DataRawFromCsv> Parse()
        {
            string completeDataSet = "QueryingPOC.Infrastructure.files.data.csv";

            var fileName = completeDataSet;
            var file = Assembly.GetExecutingAssembly().GetManifestResourceStream(fileName);

            var csvReaderConfig = new Configuration { CultureInfo = new CultureInfo("fr-FR") };

            using (var streamReader = new StreamReader(file, Encoding.UTF8, true))
            using (var csv = new CsvReader(streamReader, csvReaderConfig))
            {
                csv.Configuration.Delimiter = ";";
                csv.Configuration.RegisterClassMap<DataCsvMapper>();
                var records = csv.GetRecords<DataRawFromCsv>().ToList();
                return records;
            }
        }

        public void Import()
        {
            var rows = Parse();

            var persons = rows.Select(x => new Person
            {
                Id = Guid.NewGuid(),
                Name = x.Name,
                Surname = x.Surname,
                Birth = new DateTime(x.YearOfBirth, x.MonthOfBirth, x.DayOfBirth),
                Family = (FamilyName)Enum.Parse(typeof(FamilyName), x.Family),
                Addresses = new List<Address>
                {
                    new Address
                    {
                        Number = x.Adress1_Number,
                        Street = x.Adress1_Street,
                        City = x.Adress1_City,
                        Country = x.Adress1_Country,
                        StreetType = (StreetType)Enum.Parse(typeof(StreetType), x.Adress1_Type),
                        PostalCode = x.Adress1_PostCode
                    },
                    new Address
                    {
                        Number = x.Adress2_Number,
                        Street = x.Adress2_Street,
                        City = x.Adress2_City,
                        Country = x.Adress2_Country,
                        StreetType = (StreetType)Enum.Parse(typeof(StreetType), x.Adress2_Type),
                        PostalCode = x.Adress2_PostCode
                    }
                }
            }).ToList();

            DataMock.Persons = persons;
            DataMock.Families.Single(x => x.Name == FamilyName.Henry).Members =
                persons.Where(x => x.Family == FamilyName.Henry).ToList();
            DataMock.Families.Single(x => x.Name == FamilyName.Charles).Members =
                persons.Where(x => x.Family == FamilyName.Charles).ToList();
            DataMock.Families.Single(x => x.Name == FamilyName.Paul).Members =
                persons.Where(x => x.Family == FamilyName.Paul).ToList();

        }

        public void Dispose()
        {
        }
    }

    internal class DataRawFromCsv
    {
        public string Surname { get; set; }
        public string Name { get; set; }
        public int DayOfBirth { get; set; }
        public int MonthOfBirth { get; set; }
        public int YearOfBirth { get; set; }
        public string Family { get; set; }
        public int Adress1_Number { get; set; }
        public int Adress1_PostCode { get; set; }
        public string Adress1_City { get; set; }
        public string Adress1_Street { get; set; }
        public string Adress1_Type { get; set; }
        public string Adress1_Country { get; set; }
        public int Adress2_Number { get; set; }
        public int Adress2_PostCode { get; set; }
        public string Adress2_City { get; set; }
        public string Adress2_Street { get; set; }
        public string Adress2_Type { get; set; }
        public string Adress2_Country { get; set; }
    }

    internal class DataCsvMapper : ClassMap<DataRawFromCsv>
    {
        public DataCsvMapper()
        {
            Map(x => x.Surname).Name("prenom");
            Map(x => x.Name).Name("nom");
            Map(x => x.DayOfBirth).Name("jour_naissance");
            Map(x => x.MonthOfBirth).Name("mois_naissance");
            Map(x => x.YearOfBirth).Name("annee_naissance");
            Map(x => x.Family).Name("famille");
            Map(x => x.Adress1_Number).Name("ad1_numero");
            Map(x => x.Adress1_PostCode).Name("ad1_post_code");
            Map(x => x.Adress1_City).Name("ad1_ville");
            Map(x => x.Adress1_Street).Name("ad1_street");
            Map(x => x.Adress1_Type).Name("ad1_type");
            Map(x => x.Adress1_Country).Name("ad1_Pays");
            Map(x => x.Adress2_Number).Name("ad2_numero");
            Map(x => x.Adress2_PostCode).Name("ad2_post_code");
            Map(x => x.Adress2_City).Name("ad2_ville");
            Map(x => x.Adress2_Street).Name("ad2_street");
            Map(x => x.Adress2_Type).Name("ad2_type");
            Map(x => x.Adress2_Country).Name("ad2_Pays");
        }
    }
}
