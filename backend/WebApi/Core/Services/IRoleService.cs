using Core.Models;

namespace Core.Services
{
    public interface IRoleService
    {
        Task<IEnumerable<Role>> GetAllRoles();

        Task<bool> ChangeUserRole(Guid Id, Guid RoleId);

        Task<bool> CreateRole(string RoleName);
    }
}
