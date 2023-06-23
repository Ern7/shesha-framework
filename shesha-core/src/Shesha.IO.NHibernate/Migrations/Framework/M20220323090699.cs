using FluentMigrator;
using Shesha.IO.FluentMigrator;
using System;

namespace Shesha.Migrations.Framework
{
    [Migration(20220323090699), MsSqlOnly]
    public class M20220323090699 : AutoReversingMigration
    {
        public override void Up()
        {
            Alter.Table("Frwk_EntityProperties").AddForeignKeyColumn("ItemsTypeId", "Frwk_EntityProperties");
        }
    }
}
