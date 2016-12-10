namespace azure
{
    using System.Threading.Tasks;
    using Xunit;

    public class VisionClientTests
    {
        [Fact]
        public async Task TestGetLicensePlates()
        {
            var imagePath = "test.jpg";

            var client = new VisionClient();

            var result = await client.GetLicensePlates(imagePath);
        }
    }
}
