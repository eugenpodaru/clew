namespace azure
{
    using System.Threading.Tasks;
    using Xunit;

    public class EmotionClientTests
    {
        [Fact]
        public async Task TestGetEmotions()
        {
            var videoPath = "profile.png";

            var client = new EmotionClient();

            var result = await client.GetEmotions(videoPath);
        }
    }
}
