namespace HTTPClientFactoryAPI.Models
{
    public sealed class TodoModel
    {
        public int UserId { get; set; }
        public int Id { get; set; }
        public string Title { get; set; } = default!;
        public bool Completed { get; set; }
    }
}