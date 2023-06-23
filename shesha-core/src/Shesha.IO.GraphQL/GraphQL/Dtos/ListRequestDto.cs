using Shesha.IO.Application.Services.Dto;
using System.Collections.Generic;

namespace Shesha.IO.GraphQL.Dtos
{
    /// <summary>
    /// GraphQL specific version of FilteredPagedAndSortedResultRequestDto
    /// </summary>
    public class ListRequestDto: FilteredPagedAndSortedResultRequestDto
    {
        /// <summary>
        /// List of properties to use for the quick search
        /// </summary>
        public List<string> QuickSearchProperties { get; set; }
    }
}
