using Abp.Modules;
using Abp.Zero;
using Shesha.IO.AzureAD.Configuration;
using Shesha.Modules;
using Shesha.Settings.Ioc;
using System.Reflection;

namespace Shesha.IO.AzureAD
{
    /// <summary>
    /// This module extends module zero to add AzureAD authentication.
    /// </summary>
    [DependsOn(typeof(AbpZeroCommonModule))]
    public class SheshaAzureADModule : SheshaModule
    {
        public const string ModuleName = "Shesha.IO.AzureAD";
        public override SheshaModuleInfo ModuleInfo => new SheshaModuleInfo(ModuleName)
        {
            FriendlyName = "Shesha Azure AD",
            Publisher = "Boxfusion"
        };

        public override void PreInitialize()
        {
            IocManager.Register<ISheshaAzureADModuleConfig, SheshaAzureADModuleConfig>();
        }

        public override void Initialize()
        {
            IocManager.RegisterSettingAccessor<IAzureADSettings>();

            IocManager.RegisterAssemblyByConvention(Assembly.GetExecutingAssembly());
        }
    }
}
