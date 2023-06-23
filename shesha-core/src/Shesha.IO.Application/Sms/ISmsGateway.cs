using System;
using System.Threading.Tasks;

namespace Shesha.IO.Application.Sms
{
    /// <summary>
    /// SMS gateway
    /// </summary>
    public interface ISmsGateway
    {
        /// <summary>
        /// Send sms to specified mobile number
        /// </summary>
        Task SendSmsAsync(string mobileNumber, string body);

        Task<object> GetSettingsAsync();
        Task SetSettingsAsync(object settings);

        Type SettingsType { get; }
    }
}
