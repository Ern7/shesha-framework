using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Shesha.IO.Scheduler.SignalR;

namespace Shesha.IO.Scheduler.Extensions
{
    public static class SignalRExtensions
    {
        public static IEndpointRouteBuilder MapSignalRHubs(this IEndpointRouteBuilder endpoints)
        {
            // todo: add conventional registration
            endpoints.MapHub<SignalrAppenderHub>("/signalr-appender");
            
            return endpoints;
        }
    }
}
