using HTTPClientFactoryAPI.Interfaces;

namespace HTTPClientFactoryAPI.Configuration
{
    public sealed class ApiConfig : IApiConfig
    {
        public string BaseURL { get; set; } = default!;
    }
}
