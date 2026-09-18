using Core.Models;
using Core.Repositories;
using Core.Services;

namespace Service.Services
{
    public class RoleService(IRoleRepository roleRepository) : IRoleService
    {
        public Task<bool> ChangeUserRole(Guid Id, Guid RoleId)
        {
            return roleRepository.ChangeUserRole(Id, RoleId);
        }

        public Task<bool> CreateRole(string RoleName)
        {
            return roleRepository.CreateRole(RoleName);
        }

        public Task<IEnumerable<Role>> GetAllRoles()
        {
            return roleRepository.GetAllRoles();
        }
    }
}
