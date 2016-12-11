﻿namespace clew.Controllers
{
    using azure;
    using ExifLib;
    using Models;
    using rdw;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web.Mvc;

    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Case()
        {
            return View();
        }

        public ActionResult Gallery()
        {
            return View();
        }

        public async Task<ActionResult> Cars()
        {
            var imagePath = Server.MapPath(@"~/assets/global/img/portfolio/600x600/1 (13).jpg");

            var visionClient = new VisionClient();
            var rdwClient = new RdwClient();

            var licensePlates = await visionClient.GetLicensePlates(imagePath);

            var cars = licensePlates
                .Select(p => rdwClient.GetCarData(p))
                .ToArray();

            return View(cars);
        }

        public async Task<ActionResult> Drivers()
        {
            var imagePath = Server.MapPath(@"~/assets/pages/media/profile/Profile.png");

            var emotionClient = new EmotionClient();

            var emotion = await emotionClient.GetEmotions(imagePath);

            return View(emotion);
        }

        public ActionResult Location()
        {
            var imagePath = Server.MapPath(@"~/assets/global/img/portfolio/1200x900/1 (13).jpg");

            var reader = new ExifReader(imagePath);

            // Extract the tag data using the ExifTags enumeration
            double[] gpsLat, gpsLng;
            reader.GetTagValue(ExifTags.GPSLatitude, out gpsLat);
            reader.GetTagValue(ExifTags.GPSLongitude, out gpsLng);

            return View(new Point
            {
                Lat = gpsLat.Last(),
                Long = gpsLng.Last()
            });
        }
    }
}