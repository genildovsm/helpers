using HTTPClientFactoryAPI.Interfaces;
using HTTPClientFactoryAPI.Models;

namespace HTTPClientFactoryAPI.Services
{
    public sealed class TodoService(IApiConfig config, HttpClient httpClient) : ITodoService
    {
        private readonly IApiConfig _config = config;
        private readonly HttpClient _httpClient = httpClient;

        public async Task<TodoModel?> GetTodo(int id)
        {
            return await _httpClient.GetFromJsonAsync<TodoModel>(_config.BaseURL + "/todos/" + id);
        }
    }
}
