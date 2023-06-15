﻿using NHibernate.Driver;
using NHibernate.SqlTypes;
using Npgsql;
using System.Data.Common;

namespace Shesha.NHibernate.PostgreSql
{
    /// <summary>
    /// PostgreSql driver that uses `citext` for all string query parameters
    /// </summary>
    public class CitextPostgreSqlDriver : NpgsqlDriver
    {
        protected override void InitializeParameter(DbParameter dbParam, string name, SqlType sqlType)
        {
            base.InitializeParameter(dbParam, name, sqlType);

            var dbType = sqlType?.DbType;
            var npgsqlParam = dbParam as NpgsqlParameter;
            if (npgsqlParam != null && (dbType == System.Data.DbType.String || dbType == System.Data.DbType.AnsiString))
            {
                npgsqlParam.ResetDbType();
                npgsqlParam.NpgsqlDbType = NpgsqlTypes.NpgsqlDbType.Citext;
            }
        }
    }
}
