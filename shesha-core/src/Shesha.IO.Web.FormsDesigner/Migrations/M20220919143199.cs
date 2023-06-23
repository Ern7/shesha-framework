﻿using FluentMigrator;
using Shesha.IO.FluentMigrator;

namespace Shesha.IO.Web.FormsDesigner.Migrations
{
    [Migration(20220919143199), MsSqlOnly]
    public class M20220919143199 : AutoReversingMigration
    {
        public override void Up()
        {
            Create.Column("IsTemplate").OnTable("Frwk_FormConfigurations").AsBoolean().NotNullable().SetExistingRowsTo(false);

            Alter.Table("Frwk_FormConfigurations").AddForeignKeyColumn("TemplateId", "Frwk_FormConfigurations");
        }
    }
}
