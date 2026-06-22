using HTTPClientFactoryAPI.Interfaces;
using HTTPClientFactoryAPI.Services;
using Polly;
using Polly.Extensions.Http;

namespace HTTPClientFactoryAPI.Extensions
{
    public static class HttpClientExtensions
    {
        public static IServiceCollection AddHttpClientsRequest(this IServiceCollection services, IConfigurationManager config)
        {
            // tenta 3 vezes com timeout de 3 segundos entre as tentativas
            var retryPolicySiteJsonPlaceHolder = HttpPolicyExtensions
                .HandleTransientHttpError()
                .WaitAndRetryAsync(3, retryAttempt => TimeSpan.FromSeconds(retryAttempt));

            services.AddHttpClient<ITodoService, TodoService>(
                b => b.BaseAddress = new Uri(config["ApiConfig:BaseURL"]!)
            ).AddPolicyHandler(retryPolicySiteJsonPlaceHolder);

            return services;
        }
    }
}
