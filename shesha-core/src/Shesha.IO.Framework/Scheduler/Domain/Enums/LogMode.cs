using Shesha.Domain.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shesha.IO.Scheduler.Domain.Enums
{
    [ReferenceList("Shesha.IO.Scheduler", "LogMode")]
    public enum LogMode
    {
        FileSystem = 1,
        StoredFile = 2
    }
}
