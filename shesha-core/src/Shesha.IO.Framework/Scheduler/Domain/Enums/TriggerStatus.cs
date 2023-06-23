using Shesha.Domain.Attributes;

namespace Shesha.IO.Scheduler.Domain.Enums
{
    [ReferenceList("Shesha.IO.Scheduler", "TriggerStatus")]
    public enum TriggerStatus
    {
        Enabled = 1,
        Disabled = 2
    }
}
