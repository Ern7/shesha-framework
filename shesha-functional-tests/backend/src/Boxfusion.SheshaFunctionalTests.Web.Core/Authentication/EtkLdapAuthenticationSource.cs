using Shesha.Authorization.Users;
using Shesha.IO.Ldap.Authentication;
using Shesha.IO.Ldap.Configuration;
using Shesha.MultiTenancy;

namespace Boxfusion.SheshaFunctionalTests.Authentication
{
    public class EtkLdapAuthenticationSource : LdapAuthenticationSource<Tenant, User>
    {
        public EtkLdapAuthenticationSource(ILdapSettings settings, ISheshaLdapModuleConfig ldapModuleConfig)
            : base(settings, ldapModuleConfig)
        {
        }
    }
}
