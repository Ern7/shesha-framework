using System;

namespace Shesha.IO.Ldap.Configuration
{
    public interface ISheshaLdapModuleConfig
    {
        bool IsEnabled { get; }

        Type AuthenticationSourceType { get; }

        void Enable(Type authenticationSourceType);
    }
}