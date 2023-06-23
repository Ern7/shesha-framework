﻿using FluentMigrator;
using Shesha.IO.FluentMigrator;

namespace Shesha.Migrations
{
    [Migration(20201109112700), MsSqlOnly]
    public class M20201109112700: AutoReversingMigration
    {
        public override void Up()
        {
            Create.Table("Core_NotificationMessageAttachments")
                .WithIdAsGuid()
                .WithColumn("FileName").AsString(300).Nullable()
                .WithForeignKeyColumn("MessageId", "Core_NotificationMessages")
                .WithForeignKeyColumn("FileId", "Frwk_StoredFiles")
                .WithFullAuditColumns();
        }
    }
}
