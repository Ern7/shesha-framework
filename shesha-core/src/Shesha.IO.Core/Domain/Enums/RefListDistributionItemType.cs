using Shesha.Domain.Attributes;

namespace Shesha.Domain.Enums
{
    [ReferenceList("Shesha.IO.Core", "DistributionItemType")]
    public enum RefListDistributionItemType
    {
        System = 1,
        Email = 2,
        Sms = 3
    }
}
