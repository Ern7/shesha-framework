﻿using Castle.Core.Logging;
using Shesha.Attributes;
using System;
using System.Collections;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Shesha.Sms.BulkSms
{
    [ClassUid("e77da5f3-a406-4b8a-bb6f-e3c2d5d20c8a")]
    [Display(Name = "Bulk Sms")]
    public class BulkSmsGateway : ConfigurableSmsGateway<BulkSmsSettingsDto>, IBulkSmsGateway
    {
        private readonly IBulkSmsSettings _settings;
        public ILogger Logger { get; set; }

        public BulkSmsGateway(IBulkSmsSettings settings)
        {
            Logger = NullLogger.Instance;
            _settings = settings;
        }

        public override async Task SendSmsAsync(string mobileNumber, string body)
        {
            if (string.IsNullOrEmpty(mobileNumber))
                throw new Exception("Can't send message, mobile number is empty");

            if (string.IsNullOrEmpty(body))
                throw new Exception("Can't send empty message");

            var gatewaySettings = await _settings.GatewaySettings.GetValueAsync();

            if (string.IsNullOrWhiteSpace(gatewaySettings.ApiUrl) || string.IsNullOrWhiteSpace(gatewaySettings.Username) || string.IsNullOrWhiteSpace(gatewaySettings.Password))
                throw new Exception("Bulk SMS Gateway is not configured properly, please check settings");

            // Removing any spaces and any other common characters in a phone number.
            var msisdn = MobileHelper.CleanupmobileNo(mobileNumber);

            Logger.Info($"Sending SMS to {mobileNumber} (converted to: {msisdn}): {body}");

            string data = GetSevenBitMessage(gatewaySettings.Username, gatewaySettings.Password, msisdn, body);

            var result = await DoSendSmsAsync(data, gatewaySettings);
            if ((int)result["success"] == 1)
            {
                var response = GetFormattedServerResponse(result);

                Logger.Info($"SMS successfully sent, response: {response}");
            }
            else
            {
                throw new Exception("Could not send SMS to " + mobileNumber + ". Please contact system administrator",
                    new Exception($"Could not send SMS to {mobileNumber}. Response: {GetFormattedServerResponse(result)}"));
            }
        }

        public static string GetFormattedServerResponse(Hashtable result)
        {
            string retString = "";
            if ((int)result["success"] == 1)
            {
                retString += "Success: batch ID " + (string)result["api_batch_id"] + "API message: " + (string)result["api_message"] + "\nFull details " + (string)result["details"];
            }
            else
            {
                retString += "Fatal error: HTTP status " + (string)result["http_status_code"] + " API status " + (string)result["api_status_code"] + " API message " + (string)result["api_message"] + "\nFull details " + (string)result["details"];
            }

            return retString;
        }

        public async Task<Hashtable> DoSendSmsAsync(string data, GatewaySettings gatewaySettings)
        {
            string smsResult = await PostAsync(gatewaySettings.ApiUrl, data, gatewaySettings);

            Hashtable resultHash = new Hashtable();

            string tmp = "";
            tmp += "Response from server: " + smsResult + "\n";
            string[] parts = smsResult.Split('|');

            string statusCode = parts[0];
            string statusString = parts[1];

            resultHash.Add("api_status_code", statusCode);
            resultHash.Add("api_message", statusString);

            if (parts.Length != 3)
            {
                tmp += "Error: could not parse valid return data from server.\n";
            }
            else
            {
                if (statusCode.Equals("0"))
                {
                    resultHash.Add("success", 1);
                    resultHash.Add("api_batch_id", parts[2]);
                    tmp += "Message sent - batch ID " + parts[2] + "\n";
                }
                else if (statusCode.Equals("1"))
                {
                    // Success: scheduled for later sending.
                    resultHash.Add("success", 1);
                    resultHash.Add("api_batch_id", parts[2]);
                }
                else
                {
                    resultHash.Add("success", 0);
                    tmp += "Error sending: status code " + parts[0] + " description: " + parts[1] + "\n";
                }
            }
            resultHash.Add("details", tmp);
            return resultHash;
        }

        private async Task<string> PostAsync(string url, string data, GatewaySettings gatewaySettings)
        {
            try
            {
                #pragma warning disable SYSLIB0014
                var request = (HttpWebRequest)WebRequest.Create(url); // todo: replace with HttpClient
                #pragma warning restore SYSLIB0014

                if (gatewaySettings.UseProxy)
                {
                    var proxy = new WebProxy
                    {
                        Address = new Uri(gatewaySettings.WebProxyAddress)
                    };
                    request.Proxy = proxy;

                    if (gatewaySettings.UseDefaultProxyCredentials)
                    {
                        proxy.Credentials = CredentialCache.DefaultCredentials;
                        proxy.UseDefaultCredentials = true;
                    }
                    else
                    {
                        proxy.Credentials = new NetworkCredential(gatewaySettings.WebProxyUsername, gatewaySettings.WebProxyPassword);
                    }
                }

                byte[] buffer = Encoding.Default.GetBytes(data);

                request.Method = "POST";
                request.ContentType = "application/x-www-form-urlencoded";
                request.ContentLength = buffer.Length;

                await using var postData = await request.GetRequestStreamAsync();
                await postData.WriteAsync(buffer, 0, buffer.Length);
                    
                var webResp = await request.GetResponseAsync();//as HttpWebResponse;
                if (webResp is HttpWebResponse httpResponse)
                    Console.WriteLine(httpResponse.StatusCode);

                await using var response = webResp.GetResponseStream();
                if (response == null)
                    return null;
                using var reader = new StreamReader(response);
                var result = await reader.ReadToEndAsync();
                return result.Trim() + "\n";
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
        }

        public static string ResolveChars(string body)
        {
            Hashtable chrs = new Hashtable();
            chrs.Add('Ω', "Û");
            chrs.Add('Θ', "Ô");
            chrs.Add('Δ', "Ð");
            chrs.Add('Φ', "Þ");
            chrs.Add('Γ', "¬");
            chrs.Add('Λ', "Â");
            chrs.Add('Π', "º");
            chrs.Add('Ψ', "Ý");
            chrs.Add('Σ', "Ê");
            chrs.Add('Ξ', "±");

            string retStr = "";
            foreach (char c in body)
            {
                if (chrs.ContainsKey(c))
                {
                    retStr += chrs[c];
                }
                else
                {
                    retStr += c;
                }
            }
            return retStr;
        }

        public static string GetSevenBitMessage(string username, string password, string msisdn, string message)
        {

            /********************************************************************
            * Construct data                                                    *
            *********************************************************************/
            /*
            * Note the suggested encoding for the some parameters, notably
            * the username, password and especially the message.  ISO-8859-1
            * is essentially the character set that we use for message bodies,
            * with a few exceptions for e.g. Greek characters. For a full list,
            * see: http://developer.bulksms.com/eapi/submission/character-encoding/
            */

            string data = "";
            data += "username=" + HttpUtility.UrlEncode(username, Encoding.GetEncoding("ISO-8859-1"));
            data += "&password=" + HttpUtility.UrlEncode(password, Encoding.GetEncoding("ISO-8859-1"));
            data += "&message=" + HttpUtility.UrlEncode(ResolveChars(message), Encoding.GetEncoding("ISO-8859-1"));
            data += "&msisdn=" + msisdn;
            data += "&want_report=1";

            // allow concatenation (4 messages max)
            data += "&allow_concat_text_sms=1";
            data += "&concat_text_sms_max_parts=4";

            return data;
        }

        public static string StringToHex(string s)
        {
            string hex = "";
            foreach (char c in s)
            {
                int tmp = c;
                hex += String.Format("{0:x4}", (uint)System.Convert.ToUInt32(tmp.ToString()));
            }
            return hex;
        }

        public override async Task<BulkSmsSettingsDto> GetTypedSettingsAsync()
        {
            var gatewaySettings = await _settings.GatewaySettings.GetValueAsync();
            var settings = new BulkSmsSettingsDto
            {
                ApiUrl = gatewaySettings.ApiUrl,
                ApiUsername = gatewaySettings.Username,
                ApiPassword = gatewaySettings.Password,

                UseProxy = gatewaySettings.UseProxy,
                WebProxyAddress = gatewaySettings.WebProxyAddress,
                UseDefaultProxyCredentials = gatewaySettings.UseDefaultProxyCredentials,
                WebProxyUsername = gatewaySettings.WebProxyUsername,
                WebProxyPassword = gatewaySettings.WebProxyPassword,
            };

            return settings;
        }

        public override async Task SetTypedSettingsAsync(BulkSmsSettingsDto input)
        {
            await _settings.GatewaySettings.SetValueAsync(new GatewaySettings {
                ApiUrl = input.ApiUrl,
                Username = input.ApiUsername,
                Password = input.ApiPassword,

                UseProxy = input.UseProxy,
                WebProxyAddress = input.WebProxyAddress,
                UseDefaultProxyCredentials = input.UseDefaultProxyCredentials,
                WebProxyUsername = input.WebProxyUsername,
                WebProxyPassword = input.WebProxyPassword
            });
        }
    }
}
