using Shesha.Domain.Attributes;

namespace Shesha.Domain.Enums
{
    [ReferenceList("Shesha.IO.Core", "DistributionItemSubType")]
    public enum RefListDistributionItemSubType
    {
        Person = 1,
        Post = 2,
        Role = 3,
        PostLevel = 4
    }
}
