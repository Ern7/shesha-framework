using Abp.Application.Services.Dto;
using System;

namespace Shesha.IO.Web.FormsDesigner.Dtos
{
    public class GetFormByIdInput: GetConfigurationItemInputBase, IEntityDto<Guid>
    {
        /// <summary>
        /// Form configuration id
        /// </summary>
        public Guid Id { get; set; }
    }
}
