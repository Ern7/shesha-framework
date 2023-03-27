﻿using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Runtime.Validation;
using Shesha.ConfigurationItems;
using Shesha.ConfigurationItems.Models;
using Shesha.Domain;
using Shesha.Domain.ConfigurationItems;
using Shesha.Dto.Interfaces;
using Shesha.Extensions;
using Shesha.Services.Settings.Dto;
using Shesha.Settings;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Shesha.Services.Settings
{
    /// inheritedDoc
    public class SettingStore : ConfigurationItemManager<SettingConfiguration>, ISettingStore, ITransientDependency
    {
        private readonly IRepository<SettingConfiguration, Guid> _settingConfigurationRepository;
        private readonly IRepository<SettingValue, Guid> _settingValueRepository;
        private readonly IConfigurationFrameworkRuntime _cfRuntime;
        
        public SettingStore(
            IRepository<SettingConfiguration, Guid> repository, 
            IRepository<ConfigurationItem, Guid> configurationItemRepository, 
            IRepository<Module, Guid> moduleRepository, 
            IUnitOfWorkManager unitOfWorkManager,
            IRepository<SettingValue, Guid> settingValueRepository,
            IRepository<SettingConfiguration, Guid> settingConfigurationRepository,
            IConfigurationFrameworkRuntime cfRuntime) : base(repository, moduleRepository, unitOfWorkManager)
        {
            _settingValueRepository = settingValueRepository;
            _settingConfigurationRepository = settingConfigurationRepository;
            _cfRuntime = cfRuntime;
        }

        public override Task<SettingConfiguration> CopyAsync(SettingConfiguration item, CopyItemInput input)
        {
            throw new System.NotImplementedException();
        }

        public async Task<SettingConfiguration> CreateSettingDefinitionAsync(CreateSettingDefinitionDto input)
        {
            var module = input.ModuleId.HasValue
                ? await ModuleRepository.GetAsync(input.ModuleId.Value)
                : null;

            var validationResults = new List<ValidationResult>();

            var alreadyExist = await Repository.GetAll().Where(f => f.Module == module && f.Name == input.Name).AnyAsync();
            if (alreadyExist)
                validationResults.Add(new ValidationResult(
                    module != null
                        ? $"Setting Definition with name `{input.Name}` already exists in module `{module.Name}`"
                        : $"Setting Definition with name `{input.Name}` already exists"
                    )
                );
            if (validationResults.Any())
                throw new AbpValidationException("Please correct the errors and try again", validationResults);

            var definition = new SettingConfiguration();
            definition.Name = input.Name;
            definition.Module = module;
            definition.Description = input.Description;
            definition.Label = input.Label;

            definition.VersionNo = 1;
            definition.VersionStatus = ConfigurationItemVersionStatus.Live;
            definition.Origin = definition;

            definition.DataType = input.DataType;
            definition.EditorFormName = input.EditorFormName;
            definition.EditorFormModule = input.EditorFormModule;
            definition.OrderIndex = input.OrderIndex;
            definition.IsClientSpecific = input.IsClientSpecific;
            definition.AccessMode = input.AccessMode;
            definition.Category = input.Category;

            definition.Normalize();

            await Repository.InsertAsync(definition);

            return definition;
        }

        public override Task<SettingConfiguration> CreateNewVersionAsync(SettingConfiguration item)
        {
            throw new System.NotImplementedException();
        }

        public async Task<SettingConfiguration> GetSettingDefinitionAsync(ConfigurationItemIdentifier id)
        {
            return await Repository.GetAll().Where(new ByNameAndModuleSpecification<SettingConfiguration>(id.Name, id.Module).ToExpression()).FirstOrDefaultAsync();
        }

        public override Task<IConfigurationItemDto> MapToDtoAsync(SettingConfiguration item)
        {
            var dto = ObjectMapper.Map<SettingDefinitionDto>(item);
            return Task.FromResult<IConfigurationItemDto>(dto);
        }

        public async Task<SettingValue> GetSettingValueAsync(SettingDefinition setting, SettingManagementContext context)
        {
            return await WithUnitOfWorkAsync(async () => {
                var query = _settingValueRepository.GetAll().Where(v => v.SettingConfiguration.Name == setting.Name);
                if (!string.IsNullOrWhiteSpace(setting.ModuleName))
                    query = query.Where(v => v.SettingConfiguration.Module != null && v.SettingConfiguration.Module.Name == setting.ModuleName);

                if (setting.IsClientSpecific)
                {
                    var appKey = context.AppKey ?? _cfRuntime.FrontEndApplication;
                    query = !string.IsNullOrWhiteSpace(appKey)
                        ? query.Where(v => v.Application != null && v.Application.AppKey == appKey)
                        : query.Where(v => v.Application == null);
                }

                return await query.FirstOrDefaultAsync();
            });
        }

        private async Task<TResult> WithUnitOfWorkAsync<TResult>(Func<Task<TResult>> action)
        {
            if (UnitOfWorkManager.Current != null)
                return await action.Invoke();

            using (var uow = UnitOfWorkManager.Begin()) 
            {
                var result = await action.Invoke();
                await uow.CompleteAsync();
                
                return result;
            }
        }
    }
}
