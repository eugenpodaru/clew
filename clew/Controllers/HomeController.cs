namespace clew.Controllers
{
    using azure;
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
    }
}