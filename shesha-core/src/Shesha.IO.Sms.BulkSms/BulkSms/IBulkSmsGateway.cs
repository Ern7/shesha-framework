using Shesha.IO.Application.Sms;

namespace Shesha.IO.Sms.BulkSms
{
    public interface IBulkSmsGateway : IConfigurableSmsGateway<BulkSmsSettingsDto>
    {
    }
}
