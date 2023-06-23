using NHibernate;

namespace Shesha.IO.NHibernate
{
    public interface ISessionProvider
    {
        ISession Session { get; }
    }
}