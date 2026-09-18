using Core.Models;
using Core.Repositories;
using Core.Services;

namespace Service.Services
{
    public class UserService(IUserRepository _userRepository) : IUserService
    {
        public async Task<User?> GetUser(Guid Id)
        {
            User? user = await _userRepository.GetUser(Id);
            return user;
        }

        public async Task<int> UpdateUser(User user)
        {
            return await _userRepository.UpdateUser(user);
        }

        public async Task<int> DeleteUser(Guid Id)
        {
                return await _userRepository.DeleteUser(Id);
        }

        public async Task<IEnumerable<User?>?> GetAllUsers()
        {

            IEnumerable<User?>? users = await _userRepository.GetAllUsers();
            return users;
        }

        public async Task<IEnumerable<Order>> GetOrdersByUserIdAsync(Guid userId)
        {
            return await _userRepository.GetOrdersByUserIdAsync(userId);
        }

        public async Task<IEnumerable<UserTicket>> GetTicketsByUserIdAsync(Guid userId)
        {
            return await _userRepository.GetTicketsByUserIdAsync(userId);
        }
    }
}
