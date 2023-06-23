using FluentMigrator;
using Shesha.IO.FluentMigrator;

namespace Shesha.IO.Scheduler.Migrations
{
    [Migration(20201029151300), MsSqlOnly]
    public class M20201029151300: AutoReversingMigration
    {
        public override void Up()
        {
            Alter.Table("Core_ScheduledJobExecutions")
                .AddForeignKeyColumn("ParentExecutionId", "Core_ScheduledJobExecutions");
        }
    }
}
