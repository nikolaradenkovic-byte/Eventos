using Core.Models;

namespace Core.Repositories
{
    public interface IRoleRepository
    {
        Task<IEnumerable<Role>> GetAllRoles();
        Task<bool> ChangeUserRole(Guid Id, Guid RoleId);
        Task<bool> CreateRole(string RoleName);
    }
}
