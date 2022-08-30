using System.ComponentModel.DataAnnotations;

namespace ISTWebAPI.Models
{
    public class Stavka
    {
        public static List<Stavka> stavke = new List<Stavka>() 
        {
            new Stavka {
                id = 1,
                name = "James",
                pricePerUnit = 60507,
                unitOfMeasurement = "ad litora",
                amount = 290
            },
            new Stavka {
                id = 2,
                name = "Kitra",
                pricePerUnit = 89881,
                unitOfMeasurement = "dictum cursus.",
                amount = 670
            },
            new Stavka {
                id = 3,
                name = "Devin",
                pricePerUnit = 94811,
                unitOfMeasurement = "pharetra. Quisque",
                amount = 286
            },
            new Stavka {
                id = 4,
                name = "Stephen",
                pricePerUnit = 24146,
                unitOfMeasurement = "faucibus id,",
                amount = 703
            },
            new Stavka {
                id = 5,
                name = "Callum",
                pricePerUnit = 84758,
                unitOfMeasurement = "arcu et",
                amount = 446
            },
            new Stavka {
                id = 6,
                name = "Austin",
                pricePerUnit = 49593,
                unitOfMeasurement = "augue eu",
                amount = 8
            },
            new Stavka {
                id = 7,
                name = "Kiayada",
                pricePerUnit = 66195,
                unitOfMeasurement = "ac arcu.",
                amount = 673
            },
            new Stavka {
                id = 8,
                name = "Daphne",
                pricePerUnit = 71579,
                unitOfMeasurement = "Cum sociis",
                amount = 144
            },
            new Stavka {
                id = 9,
                name = "Kasimir",
                pricePerUnit = 4783,
                unitOfMeasurement = "fringilla. Donec",
                amount = 39
            },
            new Stavka {
                id = 10,
                name = "Kameko",
                pricePerUnit = 34795,
                unitOfMeasurement = "in magna.",
                amount = 354
            },
            new Stavka {
                id = 11,
                name = "Henry",
                pricePerUnit = 4748,
                unitOfMeasurement = "non sapien",
                amount = 169
            },
            new Stavka {
                id = 12,
                name = "Lee",
                pricePerUnit = 9214,
                unitOfMeasurement = "libero est,",
                amount = 844
            },
            new Stavka {
                id = 13,
                name = "Audrey",
                pricePerUnit = 93978,
                unitOfMeasurement = "Donec dignissim",
                amount = 376
            },
            new Stavka {
                id = 14,
                name = "Quon",
                pricePerUnit = 88113,
                unitOfMeasurement = "tellus, imperdiet",
                amount = 834
            },
            new Stavka {
                id = 15,
                name = "Celeste",
                pricePerUnit = 98316,
                unitOfMeasurement = "non, luctus",
                amount = 948
            },
            new Stavka {
                id = 16,
                name = "Jaquelyn",
                pricePerUnit = 88980,
                unitOfMeasurement = "Morbi quis",
                amount = 786
            },
            new Stavka {
                id = 17,
                name = "Irma",
                pricePerUnit = 89686,
                unitOfMeasurement = "primis in",
                amount = 849
            },
            new Stavka {
                id = 18,
                name = "Kibo",
                pricePerUnit = 91861,
                unitOfMeasurement = "in, dolor.",
                amount = 351
            },
            new Stavka {
                id = 19,
                name = "Merritt",
                pricePerUnit = 97361,
                unitOfMeasurement = "consectetuer adipiscing",
                amount = 572
            },
            new Stavka {
                id = 20,
                name = "Addison",
                pricePerUnit = 69635,
                unitOfMeasurement = "nec, cursus",
                amount = 84
            }
        };

        [Required]
        public int id { get; set; }
        [Required]
        public string name { get; set; }
        [Range(1.000, 10000000.000)]
        public float pricePerUnit { get; set; }
        [Required]
        public string unitOfMeasurement { get; set; }
        [Range(1.000, 100000.000)]
        public float amount { get; set; }
    }
}
