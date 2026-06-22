using HTTPClientFactoryAPI.Models;

namespace HTTPClientFactoryAPI.Interfaces
{
    public interface ITodoService
    {
        Task<TodoModel?> GetTodo(int id);
    }
}
