using FluentMigrator;

namespace Shesha.IO.FluentMigrator
{
    /// <summary>
    /// One way migration
    /// </summary>
    public abstract class OneWayMigration: Migration
    {
        public override void Down()
        {
            throw new System.NotImplementedException();
        }
    }
}
