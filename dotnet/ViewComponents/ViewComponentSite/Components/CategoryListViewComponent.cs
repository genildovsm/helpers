using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ViewComponentSite.Core.Entities;
using ViewComponentSite.Infrastrucuture.Persistence;

namespace ViewComponentSite.Components
{
    [ViewComponent(Name = "MeuComponente")]
    public class CategoryListViewComponent(AppDbContext context) : ViewComponent
    {
        private readonly AppDbContext _context = context;

        public async Task<IViewComponentResult> InvokeAsync()
        {
            var result = await (from c in _context.Categories select new Category
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description

            }).ToListAsync();

            return View("Index", result);
        }
    }
}
