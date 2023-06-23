using Shesha.Domain.Attributes;

namespace Shesha.IO.Scheduler.Domain.Enums
{
    [ReferenceList("Shesha.IO.Scheduler", "StartUpMode")]
    public enum StartUpMode
    {
        Automatic = 1,
        Manual = 2,
    }
}
