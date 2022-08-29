using System.ComponentModel.DataAnnotations;

namespace ISTWebAPI.Models
{
    public class Preduzece
    {
        public static List<Preduzece> preduzeca = new List<Preduzece>()
        {
            new Preduzece { id=0, name="Marko", lastName="Dujovic", phoneNumber="+381612606668", email="markonrt8519@gs.viser.edu.rs", companyAddress="Vojvode Novaka 11. deo 7D", companyName="Preduzece 1", vat="RS-TE123456789"},
            new Preduzece { id=1, name="Marko", lastName="Dujovic", phoneNumber="+381612606668", email="markonrt8519@gs.viser.edu.rs", companyAddress="Vojvode Novaka 1. deo 5D", companyName="Preduzece 2", vat="RS-TE123456788"},
            new Preduzece { id=2, name="Marko", lastName="Dujovic", phoneNumber="+381612606668", email="markonrt8519@gs.viser.edu.rs", companyAddress="Vojvode Novaka 21. deo 6D", companyName="Preduzece 3", vat="RS-TE123456787"},
            new Preduzece { id=3, name="Marko", lastName="Dujovic", phoneNumber="+381612606668", email="markonrt8519@gs.viser.edu.rs", companyAddress="Vojvode Novaka 13. deo 5D", companyName="Preduzece 4", vat="RS-TE123456786"},
            new Preduzece { id=4, name="Marko", lastName="Dujovic", phoneNumber="+381612606668", email="markonrt8519@gs.viser.edu.rs", companyAddress="Vojvode Novaka 41. deo 1D", companyName="Preduzece 5", vat="RS-TE123456785"},
            new Preduzece { id=5, name="Marko", lastName="Dujovic", phoneNumber="+381612606668", email="markonrt8519@gs.viser.edu.rs", companyAddress="Vojvode Novaka 16. deo 3D", companyName="Preduzece 6", vat="RS-TE123456784"},
            new Preduzece { id=6, name="Marko", lastName="Dujovic", phoneNumber="+381612606668", email="markonrt8519@gs.viser.edu.rs", companyAddress="Vojvode Novaka 13. deo 5D", companyName="Preduzece 7", vat="RS-TE123456783"},
            new Preduzece { id=7, name="Marko", lastName="Dujovic", phoneNumber="+381612606668", email="markonrt8519@gs.viser.edu.rs", companyAddress="Vojvode Novaka 14. deo 35D", companyName="Preduzece 8", vat="RS-TE123456782"},
            new Preduzece { id=8, name="Marko", lastName="Dujovic", phoneNumber="+381612606668", email="markonrt8519@gs.viser.edu.rs", companyAddress="Vojvode Novaka 71. deo 5D", companyName="Preduzece 9", vat="RS-TE123456781"},
            new Preduzece { id=9, name="Marko", lastName="Dujovic", phoneNumber="+381612606668", email="markonrt8519@gs.viser.edu.rs", companyAddress="Vojvode Novaka 15. deo 9D", companyName="Preduzece 10", vat="RS-TE123456780"},
            new Preduzece { id=10, name="Marko", lastName="Dujovic", phoneNumber="+381612606668", email="markonrt8519@gs.viser.edu.rs", companyAddress="Vojvode Novaka 91. deo 6D", companyName="Preduzece 11", vat="RS-TE123456799"},
            new Preduzece { id=11, name="Marko", lastName="Dujovic", phoneNumber="+381612606668", email="markonrt8519@gs.viser.edu.rs", companyAddress="Vojvode Novaka 5. deo 1D", companyName="Preduzece 12", vat="RS-TE123456779"},
            new Preduzece { id=12, name="Marko", lastName="Dujovic", phoneNumber="+381612606668", email="markonrt8519@gs.viser.edu.rs", companyAddress="Vojvode Novaka 17. deo 2D", companyName="Preduzece 13", vat="RS-TE000000000"}
        };

        [Required]
        public int id { get; set; }
        [Required]
        public string name { get; set; }
        [Required]
        public string lastName { get; set; }
        [Required]
        public string phoneNumber { get; set; }
        [Required]
        public string email { get; set; }
        [Required]
        public string companyAddress { get; set; }
        [Required]
        public string companyName { get; set; }
        [StringLength(9)]
        public string vat { get; set; }
    }
}
