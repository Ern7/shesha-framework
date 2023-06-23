using Microsoft.AspNetCore.Http;

namespace Shesha.IO.Core.Web
{
    public static class AppContextHelper
    {
        private static IHttpContextAccessor _httpContextAccessor;

        public static void Configure(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public static HttpContext Current => _httpContextAccessor?.HttpContext;
    }
}
