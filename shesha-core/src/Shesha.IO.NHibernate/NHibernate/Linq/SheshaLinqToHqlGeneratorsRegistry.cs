using NHibernate.Linq.Functions;

namespace Shesha.IO.NHibernate.Linq
{
    /// <summary>
    /// Shesha Linq to HQL generator registry. Extends NHibernate linq
    /// </summary>
    public class SheshaLinqToHqlGeneratorsRegistry : DefaultLinqToHqlGeneratorsRegistry
    {
        public SheshaLinqToHqlGeneratorsRegistry()
            : base()
        {
            this.Merge(new AsReferenceListItemNameGenerator());
        }
    }
}
