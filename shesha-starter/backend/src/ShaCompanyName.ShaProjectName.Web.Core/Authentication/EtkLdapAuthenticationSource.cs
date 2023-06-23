using Shesha.Authorization.Users;
using Shesha.IO.Ldap.Authentication;
using Shesha.IO.Ldap.Configuration;
using Shesha.MultiTenancy;

namespace ShaCompanyName.ShaProjectName.Authentication
{
    /// <summary>
    /// 
    /// </summary>
    public class EtkLdapAuthenticationSource : LdapAuthenticationSource<Tenant, User>
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="settings"></param>
        /// <param name="ldapModuleConfig"></param>
        public EtkLdapAuthenticationSource(ILdapSettings settings, ISheshaLdapModuleConfig ldapModuleConfig)
            : base(settings, ldapModuleConfig)
        {
        }
    }
}
