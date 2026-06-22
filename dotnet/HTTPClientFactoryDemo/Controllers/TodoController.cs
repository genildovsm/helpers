using HTTPClientFactoryAPI.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HTTPClientFactoryAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TodoController(ITodoService todoService) : ControllerBase
    {
        private readonly ITodoService _todoService = todoService;

        [HttpGet("[action]/{id:int}")]
        public async Task<IActionResult> GetTodo(int id)
        {
            var result = await _todoService.GetTodo(id);

            return Ok(result);
        }
    }
}
