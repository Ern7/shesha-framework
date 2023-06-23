using Abp.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Shesha.IO.Application.Services.Dto;
using System;
using System.Threading.Tasks;

namespace Shesha.IO.Application.Services
{
    /// <summary>
    /// Entity application service
    /// </summary>
    public interface IEntityAppService
    {
        /// <summary>
        /// Generic entity query
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        Task<IDynamicDataResult> QueryAllAsync(PropsFilteredPagedAndSortedResultRequestDto input);
    }

    public interface IEntityAppService<TEntity, TPrimaryKey> : IEntityAppService where TEntity : class, IEntity<TPrimaryKey>
    {
        /// <summary>
        /// Generic entity query
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        Task<IDynamicDataResult> QueryAsync(GetDynamicEntityInput<TPrimaryKey> input);
    }
}
