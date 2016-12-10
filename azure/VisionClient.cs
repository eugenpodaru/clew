namespace azure
{
    using Microsoft.ProjectOxford.Vision;
    using Microsoft.ProjectOxford.Vision.Contract;
    using System.IO;
    using System.Text.RegularExpressions;
    using System.Threading.Tasks;
    using System.Linq;

    public class VisionClient
    {
        private static readonly Regex licensePlateRegex = new Regex(@"(\w{3}\d{3})|(\w{2}-\w{2}-\w{2})|(\d{2}-\w{3}-\d{1})|(\d{1}-\w{3}-\d{2})|(\w{1}-\d{3}-\w{2})|(\w{2}-\d{3}-\w)");

        private readonly VisionServiceClient client;

        public VisionClient()
        {
            client = new VisionServiceClient("94bf4865d8a740fabbb9a334db6cd456");
        }

        public async Task<string[]> GetLicensePlates(string imagePath)
        {
            using (Stream imageFileStream = File.OpenRead(imagePath))
            {
                var ocrResult = await client.RecognizeTextAsync(imageFileStream, "en");

                var licensePlates = ocrResult
                    .Regions
                    .SelectMany(r => r.Lines)
                    .SelectMany(l => l.Words)
                    .Select(l => l.Text)
                    .Where(t => licensePlateRegex.IsMatch(t))
                    .ToArray();

                return licensePlates;
            }
        }
    }
}
