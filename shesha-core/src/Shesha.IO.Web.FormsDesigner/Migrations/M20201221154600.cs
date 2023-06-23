﻿using FluentMigrator;
using Shesha.IO.FluentMigrator;

namespace Shesha.IO.Web.FormsDesigner.Migrations
{
    [Migration(20201221154600), MsSqlOnly]
    public class M20201221154600: AutoReversingMigration
    {
        public override void Up()
        {
            // Shesha.IO.Web.FormsDesigner.Domain.Form
            Create.Table("Forms")
                .WithIdAsGuid()
                .WithFullAuditColumns()
                .WithColumn("Description").AsStringMax().Nullable()
                .WithColumn("Markup").AsStringMax().Nullable()
                .WithColumn("ModelType").AsStringMax().Nullable()
                .WithColumn("Name").AsString(100).Nullable()
                .WithColumn("Path").AsString(300).Nullable();
        }
    }
}
