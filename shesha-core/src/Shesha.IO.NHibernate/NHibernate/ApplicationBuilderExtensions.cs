using Microsoft.AspNetCore.Builder;
using Shesha.IO.NHibernate.Middlewares;

namespace Shesha.IO.NHibernate
{
    public static class ApplicationBuilderExtensions
    {
        public static IApplicationBuilder UseNHibernateSessionPerRequest(this IApplicationBuilder app)
        {
            return app
                .UseMiddleware<NHibernateSessionPerRequestMiddleware>();
        }
    }
}
