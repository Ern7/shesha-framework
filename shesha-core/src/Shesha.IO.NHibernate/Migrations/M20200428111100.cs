﻿using FluentMigrator;
using Shesha.IO.FluentMigrator;

namespace Shesha.Migrations
{
    [Migration(20200428111100), MsSqlOnly]
    public class M20200428111100: Migration
    {
        public override void Up()
        {
            Alter.Table("Core_Addresses")
                .AddDiscriminator();

            Execute.Sql("update Core_Addresses set Frwk_Discriminator = 'Shesha.IO.Core.Address'");
        }

        public override void Down()
        {
            throw new System.NotImplementedException();
        }
    }
}
