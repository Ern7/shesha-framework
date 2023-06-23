using Shesha.Domain.Attributes;

namespace Shesha.Domain.Enums
{
    [ReferenceList("Shesha.IO.Framework", "OtpSendStatus")]
    public enum OtpSendStatus
    {
        Sent = 1,
        Failed = 2,
        Ignored = 3
    }
}
