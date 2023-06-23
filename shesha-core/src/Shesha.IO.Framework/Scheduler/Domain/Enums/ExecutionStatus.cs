using Shesha.Domain.Attributes;

namespace Shesha.IO.Scheduler.Domain.Enums
{
    [ReferenceList("Shesha.IO.Scheduler", "ExecutionStatus")]
    public enum ExecutionStatus
    {
        InProgress = 1,
        Completed = 2,
        Failed = 3,
        Enqueued = 4,
    }
}
