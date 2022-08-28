using ISTWebAPI.Models;
using System.Reflection.Metadata.Ecma335;
using System.Text.RegularExpressions;

namespace ISTWebAPI.Validation
{
    public static class Validation
    {
        private static readonly string nameRegex = "^[a-zA-Z ]*$"; //Dozvoljava samo slova i prazan znak
        private static readonly string phoneRegex = "\\+(9[976]\\d|8[987530]\\d|6[987]\\d|5[90]\\d|42\\d|3[875]\\d|\r\n2[98654321]\\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|\r\n4[987654310]|3[9643210]|2[70]|7|1)\\d{1,14}$";
        private static readonly string emailRegex = "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])";
        private static readonly string vatRegex = "^[A-Za-z]{2,4}(?=.{2,12}$)[-_\\s0-9]*(?:[a-zA-Z][-_\\s0-9]*){0,2}$";
        private static readonly string addressRegex = "([\\w \\.\\,])+";
        public static bool validatePreduzece(Preduzece p)
        {
            if (Regex.IsMatch(p.name, nameRegex) && Regex.IsMatch(p.lastName, nameRegex) && Regex.IsMatch(p.companyName, nameRegex))
            {
                if (Regex.IsMatch(p.phoneNumber, phoneRegex))
                {
                    if (Regex.IsMatch(p.email, emailRegex))
                    {
                        if (Regex.IsMatch(p.vat, vatRegex))
                        {
                            if (Regex.IsMatch(p.companyAddress, addressRegex))
                            {
                                return true;
                            }
                        }
                    }
                }
            }

            return false;
        }

        public static bool validateStavka(Stavka s)
        {
            if (Regex.IsMatch(s.name, nameRegex))
            {
                return true;
            }

            return false;
        }
    }
}
