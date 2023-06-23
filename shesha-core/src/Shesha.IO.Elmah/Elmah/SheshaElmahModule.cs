using System.Reflection;
using Abp.Modules;

namespace Shesha.IO.Elmah
{
    /// <summary>
    /// Shesha Elmah module
    /// </summary>
    public class SheshaElmahModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(Assembly.GetExecutingAssembly());
        }
    }
}
