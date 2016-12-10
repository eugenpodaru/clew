namespace rdw
{
    using Xunit;

    public class RdwClientTests
    {
        [Fact]
        public void TestRdwClient()
        {
            var client = new RdwClient();

            var carData = client.GetCarData("HN700K");
        }
    }
}
