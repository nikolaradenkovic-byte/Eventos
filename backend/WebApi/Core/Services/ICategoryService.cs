using Core.Models;

namespace Core.Services
{
    public interface ICategoryService
    {
        Task<IEnumerable<Category>> GetAllAsync();

        Task<Category?> GetByIdAsync(Guid id);

        Task<Category> CreateAsync(Category category);


    }
}