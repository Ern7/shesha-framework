using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Shesha.IO.Firebase.Dtos
{
    public class UpdateFirebaseSettingsInput
    {
        /// <summary>
        /// serviceAccountKey.json
        /// </summary>
        [BindProperty(Name = "file")]
        public IFormFile File { get; set; }
    }
}