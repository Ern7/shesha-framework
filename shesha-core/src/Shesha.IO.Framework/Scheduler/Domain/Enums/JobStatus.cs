using Shesha.Domain.Attributes;

namespace Shesha.IO.Scheduler.Domain.Enums
{
    [ReferenceList("Shesha.IO.Scheduler", "JobStatus")]
    public enum JobStatus
    {
        Active = 1,
        InActive = 2,
    }
}
