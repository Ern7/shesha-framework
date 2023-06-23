using System.Collections.Generic;
using System.Security.Claims;

namespace Shesha.IO.GraphQL.Middleware
{
    /// <summary>
    /// GraphQL user context
    /// </summary>
    public class GraphQLUserContext : Dictionary<string, object>
    {
        /// <summary>
        /// Current user
        /// </summary>
        public ClaimsPrincipal User { get; set; }
    }
}
