﻿using System;

namespace Shesha.IO.Scheduler.Services.ScheduledJobs.Dto
{
    /// <summary>
    /// Start scheduled job input
    /// </summary>
    public class StartJobInput
    {
        /// <summary>
        /// Job Id
        /// </summary>
        public Guid JobId { get; set; }
    }
}
