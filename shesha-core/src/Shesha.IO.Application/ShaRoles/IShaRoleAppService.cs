using Abp.Application.Services;
using Shesha.IO.Application.Services.Dto;
using Shesha.ShaRoles.Dto;
using System;

namespace Shesha.ShaRoles
{
    public interface IShaRoleAppService : IAsyncCrudAppService<ShaRoleDto, Guid, FilteredPagedAndSortedResultRequestDto, CreateShaRoleDto, ShaRoleDto>
    {
    }
}
