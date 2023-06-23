using FluentMigrator;
using Shesha.IO.FluentMigrator;

namespace Shesha.IO.Scheduler.Migrations
{
    [Migration(20221111144200), MsSqlOnly]
    public class M20221111144200 : AutoReversingMigration
    {
        public override void Up()
        {
            Alter.Table("Core_ScheduledJobExecutions")
                .AddColumn("JobStatistics").AsStringMax().Nullable();
        }
    }
}
