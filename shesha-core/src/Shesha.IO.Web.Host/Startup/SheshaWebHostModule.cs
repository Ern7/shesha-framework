using Abp.Hangfire;
using Abp.Hangfire.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Shesha.IO.GraphQL;
using Shesha.IO.Web.FormsDesigner;

namespace Shesha.IO.Web.Host.Startup
{
    [DependsOn(typeof(SheshaWebCoreModule), 
        typeof(SheshaFormsDesignerModule),
        typeof(AbpHangfireAspNetCoreModule),
        typeof(SheshaGraphQLModule))]
    public class SheshaWebHostModule: AbpModule
    {
        public SheshaWebHostModule()
        {
        }

        public override void PreInitialize()
        {
            base.PreInitialize();
            /*
            Configuration.BackgroundJobs.IsJobExecutionEnabled = false;
            Configuration.Auditing.IsEnabled = false;
            */
            Configuration.BackgroundJobs.UseHangfire();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(SheshaWebHostModule).GetAssembly());
        }
    }
}
