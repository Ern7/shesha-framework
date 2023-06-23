using FluentMigrator;
using Shesha.IO.FluentMigrator;

namespace Shesha.IO.Web.FormsDesigner.Migrations
{
    [Migration(20230110170799), MsSqlOnly]
    public class M20230110170799 : OneWayMigration
    {
        public override void Up()
        {
            Delete.Column("Frwk_Discriminator").FromTable("Frwk_ConfigurableComponents");
        }
    }
}
