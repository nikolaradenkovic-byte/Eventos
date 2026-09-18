using Core.Models;

namespace Core.Repositories
{
    public interface ICategoryRepository
    {
        Task<IEnumerable<Category>> GetAllAsync();

        Task<Category?> GetByIdAsync(Guid id);

        Task<bool> CreateAsync(Category category);

    }
}