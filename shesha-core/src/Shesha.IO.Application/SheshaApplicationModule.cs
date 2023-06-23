﻿using Abp;
using Abp.AutoMapper;
using Abp.Configuration.Startup;
using Abp.Dependency;
using Abp.Modules;
using Abp.Net.Mail;
using Abp.Net.Mail.Smtp;
using Abp.Notifications;
using Abp.Reflection;
using Castle.MicroKernel.Registration;
using Shesha.Authorization;
using Shesha.Email;
using Shesha.IO.GraphQL;
using Shesha.Modules;
using Shesha.Notifications;
using Shesha.Otp.Configuration;
using Shesha.Push;
using Shesha.Push.Configuration;
using Shesha.Reflection;
using Shesha.Settings.Ioc;
using Shesha.IO.Application.Sms;
using Shesha.IO.Application.Sms.Configuration;
using Shesha.Startup;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace Shesha
{
    [DependsOn(
        typeof(AbpKernelModule),
        typeof(SheshaCoreModule),
        typeof(SheshaGraphQLModule),
        typeof(AbpAutoMapperModule))]
    public class SheshaApplicationModule : SheshaSubModule<SheshaFrameworkModule>
    {
        public override async Task<bool> InitializeConfigurationAsync()
        {
            return await ImportConfigurationAsync();
        }

        public override void PreInitialize()
        {
            IocManager.Register<IShaApplicationModuleConfiguration, ShaApplicationModuleConfiguration>();

            Configuration.Notifications.Providers.Add<ShaNotificationProvider>();
            Configuration.Notifications.Notifiers.Add<EmailRealTimeNotifier>();
            Configuration.Notifications.Notifiers.Add<SmsRealTimeNotifier>();
            Configuration.Notifications.Notifiers.Add<PushRealTimeNotifier>();

            Configuration.Authorization.Providers.Add<SheshaAuthorizationProvider>();
            Configuration.Authorization.Providers.Add<DbAuthorizationProvider>();

            // replace email sender
            Configuration.ReplaceService<ISmtpEmailSenderConfiguration, SmtpEmailSenderSettings>(DependencyLifeStyle.Transient);

            // ToDo: migrate Notification to ABP 6.6.2
            //Configuration.Notifications.Distributers.Clear();
            //Configuration.Notifications.Distributers.Add<ShaNotificationDistributer>();

            Configuration.ReplaceService<INotificationPublisher, ShaNotificationPublisher>(DependencyLifeStyle.Transient);

            IocManager.IocContainer.Register(
                Component.For<IEmailSender>().Forward<ISheshaEmailSender>().Forward<SheshaEmailSender>().ImplementedBy<SheshaEmailSender>().LifestyleTransient()
            );

            #region Push notifications

            IocManager.RegisterSettingAccessor<IPushSettings>(s => {
                s.PushNotifier.WithDefaultValue(NullPushNotifier.Uid);
            });
            IocManager.Register<NullPushNotifier, NullPushNotifier>(DependencyLifeStyle.Transient);
            IocManager.IocContainer.Register(
                Component.For<IPushNotifier>().UsingFactoryMethod(f =>
                {
                    var settings = f.Resolve<IPushSettings>();
                    var pushNotifier = settings.PushNotifier.GetValue();

                    var pushNotifierType = !string.IsNullOrWhiteSpace(pushNotifier)
                        ? f.Resolve<ITypeFinder>().Find(t => typeof(IPushNotifier).IsAssignableFrom(t) && t.GetClassUid() == pushNotifier).FirstOrDefault()
                        : null;

                    if (pushNotifierType == null)
                        pushNotifierType = typeof(NullPushNotifier);

                    return pushNotifierType != null
                        ? f.Resolve(pushNotifierType) as IPushNotifier
                        : null;
                }, managedExternally: true).LifestyleTransient()
            );

            #endregion

            #region SMS Gateways

            IocManager.RegisterSettingAccessor<ISmsSettings>(s => {
                s.SmsGateway.WithDefaultValue(NullSmsGateway.Uid);
            });
            IocManager.Register<NullSmsGateway, NullSmsGateway>(DependencyLifeStyle.Transient);
            IocManager.IocContainer.Register(
                Component.For<ISmsGateway>().UsingFactoryMethod(f =>
                {
                    var settings = f.Resolve<ISmsSettings>();
                    var gatewayUid = settings.SmsGateway.GetValue();

                    var gatewayType = !string.IsNullOrWhiteSpace(gatewayUid)
                        ? f.Resolve<ITypeFinder>().Find(t => typeof(ISmsGateway).IsAssignableFrom(t) && t.GetClassUid() == gatewayUid).FirstOrDefault()
                        : null;

                    var gateway = gatewayType != null
                        ? f.Resolve(gatewayType) as ISmsGateway
                        : null;

                    return gateway ?? new NullSmsGateway();
                }, managedExternally: true).LifestyleTransient()
            );

            #endregion
        }

        public override void Initialize()
        {
            IocManager.RegisterSettingAccessor<IOtpSettings>(s => {
                s.PasswordLength.WithDefaultValue(OtpDefaults.DefaultPasswordLength);
                s.Alphabet.WithDefaultValue(OtpDefaults.DefaultAlphabet);
                s.DefaultLifetime.WithDefaultValue(OtpDefaults.DefaultLifetime);
                s.DefaultSubjectTemplate.WithDefaultValue(OtpDefaults.DefaultSubjectTemplate);
                s.DefaultBodyTemplate.WithDefaultValue(OtpDefaults.DefaultBodyTemplate);

                s.DefaultEmailSubjectTemplate.WithDefaultValue(OtpDefaults.DefaultEmailSubjectTemplate);
                s.DefaultEmailSubjectTemplate.WithDefaultValue(OtpDefaults.DefaultEmailBodyTemplate);
            });
            
            

            IocManager.Register<ISheshaAuthorizationHelper, ApiAuthorizationHelper>(DependencyLifeStyle.Transient);
            IocManager.Register<ISheshaAuthorizationHelper, EntityCrudAuthorizationHelper>(DependencyLifeStyle.Transient);

            var thisAssembly = Assembly.GetExecutingAssembly();
            IocManager.RegisterAssemblyByConvention(thisAssembly);

            /* api not used now, this registration causes problems in the IoC. Need to solve IoC problem before uncommenting
            var schemaContainer = IocManager.Resolve<ISchemaContainer>();
            var serviceProvider = IocManager.Resolve<IServiceProvider>();
            schemaContainer.RegisterCustomSchema("api", new ApiSchema(serviceProvider));
            */

            Configuration.Modules.AbpAutoMapper().Configurators.Add(
                // Scan the assembly for classes which inherit from AutoMapper.Profile
                cfg => cfg.AddMaps(thisAssembly)
            );
        }
    }
}
