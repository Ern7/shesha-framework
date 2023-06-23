using System;

namespace Shesha.IO.AzureAD.Configuration
{
    public interface ISheshaAzureADModuleConfig
    {
        bool IsEnabled { get; }

        Type AuthenticationSourceType { get; }

        void Enable(Type authenticationSourceType);
    }
}