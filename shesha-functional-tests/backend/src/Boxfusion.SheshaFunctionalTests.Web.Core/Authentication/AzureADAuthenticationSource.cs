using Shesha.Authorization.Users;
using Shesha.IO.AzureAD.Authentication;
using Shesha.IO.AzureAD.Configuration;
using Shesha.MultiTenancy;

namespace Boxfusion.SheshaFunctionalTests.Authentication
{
    public class EtkAzureADAuthenticationSource : AzureADAuthenticationSource<Tenant, User>
    {
        public EtkAzureADAuthenticationSource(IAzureADSettings settings, ISheshaAzureADModuleConfig ldapModuleConfig)
            : base(settings, ldapModuleConfig)
        {
        }
    }
}
