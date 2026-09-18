using Core.Models;
using Core.Repositories;

namespace Core.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<Category?> GetByIdAsync(Guid id)
        {
            return await _categoryRepository.GetByIdAsync(id);
        }

        public async Task<Category> CreateAsync(Category category)
        {
            await _categoryRepository.CreateAsync(category);

            return category;
        }

        public async Task<IEnumerable<Category>> GetAllAsync()
        {
            return await _categoryRepository.GetAllAsync();


        }

        //public async Task<bool> UpdateAsync(Category category)
        //{
        //    var existing = await _categoryRepository.GetByIdAsync(category.Id);

        //    if (existing == null)
        //        return false;

        //    return await _categoryRepository.UpdateAsync(category);
        //}

        //        public async Task<bool> DeleteAsync(Guid id)
        //        {
        //            var existing = await _categoryRepository.GetByIdAsync(id);

        //            if (existing == null)
        //                return false;

        //            return await _categoryRepository.DeleteAsync(id);
        //        }

        //        public Task<IEnumerable<Category>> GetAllAsync()
        //        {
        //            throw new NotImplementedException();
        //        }

        //        public Task<bool> UpdateAsync(Category category)
        //        {
        //            throw new NotImplementedException();
    }
}
