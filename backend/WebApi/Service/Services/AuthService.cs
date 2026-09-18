using Core.Models;
using Core.Repositories;
using Core.Services;
using Microsoft.IdentityModel.JsonWebTokens;
using Service.Auth;

namespace Service.Services
{
    public class AuthService(IAuthRepository authRepository, TokenProvider tokenProvider) : IAuthService
    {
        public async Task<int> CreateUser(User user)
        {
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            return await authRepository.CreateUser(user);
        }

        public async Task<Response?> Login(Credentials credentials)
        {
            User user = await authRepository.Login(credentials.Email, credentials.Password);
            bool verified = BCrypt.Net.BCrypt.Verify(credentials.Password, user.Password);

            if (!verified || user is null)
            {
                return null;
            }

            string role = await authRepository.GetUserRole(user.Id);

            return await IssueTokensAsync(user, role);
        }

        public async Task<bool> Logout(Response token)
        {
            var handler = new JsonWebTokenHandler();
            var jsonToken = handler.ReadJsonWebToken(token.AccessToken);
            string? userIdClaim = jsonToken.Subject;

            if (!Guid.TryParse(userIdClaim, out Guid userId))
            {
                return false;
            }

            var activeTokens = await authRepository.GetActiveRefreshTokensByUserId(userId);

            RefreshTokenRecord? matchedToken = null;
            foreach (var tokenRecord in activeTokens)
            {
                if (tokenProvider.VerifyTokenHash(token.RefreshToken, tokenRecord.TokenHash))
                {
                    matchedToken = tokenRecord;
                    break;
                }
            }

            if (matchedToken is null)
            {
                return false;
            }

            await authRepository.RevokeRefreshToken(matchedToken.Id);

            return true;
        }



        public async Task<Response?> RefreshToken(Response oldToken)
        {
            var handler = new JsonWebTokenHandler();
            var jsonToken = handler.ReadJsonWebToken(oldToken.AccessToken);
            string? userIdClaim = jsonToken.Subject;

            if (!Guid.TryParse(userIdClaim, out Guid userId))
            {
                return null;
            }

            var activeTokens = await authRepository.GetActiveRefreshTokensByUserId(userId);

            RefreshTokenRecord? matchedToken = null;
            foreach (var tokenRecord in activeTokens)
            {
                if (tokenProvider.VerifyTokenHash(oldToken.RefreshToken, tokenRecord.TokenHash))
                {
                    matchedToken = tokenRecord;
                    break;
                }
            }

            if (matchedToken is null)
            {
                return null;
            }

            await authRepository.RevokeRefreshToken(matchedToken.Id);

            User? user = await authRepository.GetUserById(userId);
            if (user is null) return null;

            string role = await authRepository.GetUserRole(user.Id);

            return await IssueTokensAsync(user, role);
        }

        public async Task<Guid> GetRoleId(string roleName)
        {
            return await authRepository.GetRoleId(roleName);
        }

        private async Task<Response> IssueTokensAsync(User user, string role)
        {
            string accessToken = tokenProvider.CreateAccessToken(user, role);
            string rawRefreshToken = tokenProvider.GenerateRefreshToken();
            string bcryptHash = tokenProvider.HashTokenWithBCrypt(rawRefreshToken);
            DateTime expiresAt = DateTime.UtcNow.AddDays(7);

            await authRepository.SaveRefreshToken(user.Id, bcryptHash, expiresAt);

            return new Response
            {
                AccessToken = accessToken,
                RefreshToken = rawRefreshToken
            };
        }
    }
}