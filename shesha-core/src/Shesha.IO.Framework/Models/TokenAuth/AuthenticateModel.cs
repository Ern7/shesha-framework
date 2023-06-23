﻿using System.ComponentModel.DataAnnotations;
using Abp.Authorization.Users;

namespace Shesha.Models.TokenAuth
{
    public class AuthenticateModel
    {
        [Required]
        [StringLength(AbpUserBase.MaxEmailAddressLength)]
        public string UserNameOrEmailAddress { get; set; }

        [Required]
        [StringLength(AbpUserBase.MaxPlainPasswordLength)]
        public string Password { get; set; }

        //public bool RememberClient { get; set; }
        
        /// <summary>
        /// Optional IMEI number. Is used for mobile applications
        /// </summary>
        public string IMEI { get; set; }
    }
}
