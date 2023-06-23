using NHibernate.Mapping.ByCode;

namespace Shesha.IO.NHibernate.Maps
{
    public interface ICustomMapper
    {
        void BeforeMapProperty(IModelInspector inspector, PropertyPath member, IPropertyMapper customizer);
    }
}
