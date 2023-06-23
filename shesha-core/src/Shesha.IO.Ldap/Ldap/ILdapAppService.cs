using Abp.Application.Services;
using Shesha.IO.Ldap.Dtos;
using System;
using System.Threading.Tasks;

namespace Shesha.IO.Ldap
{
    /// <summary>
    /// LDAP application service
    /// </summary>
    [Obsolete]
    public interface ILdapAppService : IApplicationService
    {
        /// <summary>
        /// Update LDAP settings
        /// </summary>
        Task UpdateSettings(LdapSettingsDto dto);

        /// <summary>
        /// Returns LDAP settings
        /// </summary>
        Task<LdapSettingsDto> GetSettings();
    }
}
