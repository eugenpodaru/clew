namespace rdw
{
    using SODA;
    using System.Linq;

    public class RdwClient
    {
        private readonly SodaClient client;

        public RdwClient()
        {
            client = new SodaClient("https://opendata.rdw.nl", "Dka8HvCT6avyRpGRELMqo9WuJ");
        }

        public CarData GetCarData(string licensePlate)
        {
            // Get a reference to the resource itself
            // The result (a Resouce object) is a generic type
            // The type parameter represents the underlying rows of the resource
            // and can be any JSON-serializable class
            var dataset = client.GetResource<object>("m9d7-ebf2");

            var query = new SoqlQuery();
            query.FullTextSearch(licensePlate);

            var carData = dataset.Query<CarData>(query);

            return carData.FirstOrDefault();
        }
    }
}
