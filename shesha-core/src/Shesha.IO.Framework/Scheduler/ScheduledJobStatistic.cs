﻿using Shesha.JsonEntities;

namespace Shesha.IO.Scheduler
{
    public class ScheduledJobStatistic : JsonEntity
    {
        public int NumSucceeded { get; set; }

        public int NumSkipped { get; set; }

        public int NumErrors { get; set; }
    }
}
