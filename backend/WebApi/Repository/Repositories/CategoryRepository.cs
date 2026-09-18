using Core.Models;
using Core.Repositories;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace Repository.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly string _connectionString;

        public CategoryRepository(IConfiguration configuration)
        {
            _connectionString =
                configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException(
                    "Connection string nije pronađen.");
        }

        //public async Task<IEnumerable<Category>> GetAllAsync()
        //{
        //    using var connection = new SqlConnection(_connectionString);

        //    const string sql = """
        //        SELECT Id, CategoryName
        //        FROM Category;
        //        """;

        //    return await connection.QueryAsync<Category>(sql);
        //}

        public async Task<Category?> GetByIdAsync(Guid id)
        {
            using var connection = new SqlConnection(_connectionString);

            const string sql = """
                SELECT Id, CategoryName
                FROM eventos.Category
                WHERE Id = @Id;
                """;

            return await connection.QueryFirstOrDefaultAsync<Category>(
                sql,
                new { Id = id });
        }

        public async Task<bool> CreateAsync(Category category)
        {
            using var connection = new SqlConnection(_connectionString);

            const string sql = """
                INSERT INTO eventos.Category
                    (Id, CategoryName)
                VALUES
                    (@Id, @CategoryName);
                """;

            var rows = await connection.ExecuteAsync(sql, category);

            return rows > 0;
        }

        public async Task<IEnumerable<Category>> GetAllAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = """
            SELECT * FROM eventos.Category
            """;

            IEnumerable<Category> categories = await connection.QueryAsync<Category>(sql);
            return categories;
        }

   

        //public Task<bool> DeleteAsync(Guid id)
        //{
        //    throw new NotImplementedException();
        //}

        //public Task<bool> UpdateAsync(Category category)
        //{
        //    throw new NotImplementedException();
        //}

        //public Task<bool> DeleteAsync(Guid id)
        //{
        //    throw new NotImplementedException();
        //}

        //public async Task<bool> UpdateAsync(Category category)
        //{
        //    using var connection = new SqlConnection(_connectionString);

        //    const string sql = """
        //        UPDATE Category
        //        SET CategoryName = @CategoryName
        //        WHERE Id = @Id;
        //        """;

            //    var rows = await connection.ExecuteAsync(sql, category);

            //    return rows > 0;
            //}

            //public async Task<bool> DeleteAsync(Guid id)
            //{
            //    using var connection = new SqlConnection(_connectionString);

            //    const string sql = """
            //        DELETE FROM Category
            //        WHERE Id = @Id;
            //        """;

            //    var rows = await connection.ExecuteAsync(
            //        sql,
            //        new { Id = id });

            //    return rows > 0;
            //}

            //public Task<bool> UpdateAsync(Category category)
            //{
            //    throw new NotImplementedException();
            //}
    }
}