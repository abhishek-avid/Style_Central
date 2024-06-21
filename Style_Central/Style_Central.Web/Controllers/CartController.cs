using Style_Central.Web.Helper;
using Microsoft.AspNetCore.Mvc;

namespace Style_Central.Web.Controllers;

[SessionValidation]
public class CartController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}
