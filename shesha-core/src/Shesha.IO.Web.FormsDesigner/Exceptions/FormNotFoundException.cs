using Shesha.ConfigurationItems.Exceptions;
using Shesha.IO.Web.FormsDesigner.Domain;

namespace Shesha.IO.Web.FormsDesigner.Exceptions
{
    /// <summary>
    /// Form not found exception
    /// </summary>
    public class FormNotFoundException: ConfigurationItemNotFoundException
    {
        public FormNotFoundException(string module, string name): base(FormConfiguration.ItemTypeName, module, name, null) 
        {
            Name = name;
            Module = module;
            Code = 404;
        }
    }
}