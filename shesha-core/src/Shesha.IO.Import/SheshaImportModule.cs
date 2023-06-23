﻿using System.Reflection;
using Abp.AspNetCore;
using Abp.AspNetCore.Configuration;
using Abp.AutoMapper;
using Abp.Modules;
using Shesha.IO.Scheduler;

namespace Shesha.IO.Import
{
    [DependsOn(
        typeof(AbpAutoMapperModule),
        typeof(SheshaSchedulerModule),
        typeof(AbpAspNetCoreModule)
    )]
    public class SheshaImportModule : AbpModule
    {
        public override void Initialize()
        {
            var thisAssembly = Assembly.GetExecutingAssembly();
            IocManager.RegisterAssemblyByConvention(thisAssembly);

            Configuration.Modules.AbpAutoMapper().Configurators.Add(
                // Scan the assembly for classes which inherit from AutoMapper.Profile
                cfg => cfg.AddMaps(thisAssembly)
            );
        }

        public override void PreInitialize()
        {
            Configuration.Modules.AbpAspNetCore().CreateControllersForAppServices(
                typeof(SheshaImportModule).Assembly,
                moduleName: "Import",
                useConventionalHttpVerbs: true);
        }
    }
}
