namespace CaseLib;
using System.Text;

public class UtilityFunctions
{
     // 1 - String dönen fonksiyon
        public static string GetMessage1()
        {
            return "Hello from DLL - Message 1";
        }

        // 2 - String dönen fonksiyon
        public static string GetMessage2()
        {
            return "Hello from DLL - Message 2";
        }

        // 3 - String dönen fonksiyon
        public static string GetMessage3()
        {
            return "Hello from DLL - Message 3";
        }

        // 4 - Sistem saatini dönen fonksiyon
        public static string GetSystemTime()
        {
            return DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        }

        // 5 - Base64 image verisini hex string'e çeviren fonksiyon
        public static string ConvertBase64ToHex(string base64Input)
        {
            byte[] imageBytes = Convert.FromBase64String(base64Input);
            StringBuilder hex = new StringBuilder(imageBytes.Length * 2);

            foreach (byte b in imageBytes)
            {
                hex.AppendFormat("{0:x2}", b);
            }

            return hex.ToString();
        }
}
