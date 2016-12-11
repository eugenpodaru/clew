namespace azure
{
    using Microsoft.ProjectOxford.Emotion;
    using Microsoft.ProjectOxford.Emotion.Contract;
    using System.IO;
    using System.Linq;
    using System.Threading.Tasks;

    public class EmotionClient
    {
        private readonly EmotionServiceClient client;

        public EmotionClient()
        {
            client = new EmotionServiceClient("0e20d547e8674fa598d3d3759d58d9cc");
        }

        public async Task<Emotion> GetEmotions(string imagePath)
        {
            using (Stream imageFileStream = File.OpenRead(imagePath))
            {
                var emotions = await client.RecognizeAsync(imageFileStream);

                return emotions.FirstOrDefault();
            }
        }
    }
}
