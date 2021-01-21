using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
using ChatApi.Models;
using ChatApi.Helpers;
using System;

namespace ChatApi.Repositories
{
    public class AccountRepository : BaseMongoRepo, IAccountRepository
    {
        readonly IMongoCollection<User> users;

        public AccountRepository(IDbSettings settings): base(settings)
        {
            users = mongoDatabase.GetCollection<User>("Users");
        }

        public async Task<IEnumerable<UserListObject>> GetAllUsers()
        {
            var filter = Builders<User>.Filter.Empty;
            var projection = Builders<User>.Projection.Include("id").Include("Username");
            return await users.Find<User>(filter).Project<UserListObject>(projection).ToListAsync();
        }

        public async Task<User> GetUser(string userId)
        {
            return await users.Find(u => u.Id == userId).FirstOrDefaultAsync();
        }

        public async Task<User> GetUserByUsername(string username)
        {
            return await users.Find(u => u.Username == username).FirstOrDefaultAsync();
        }

        public async Task UpdateUser(string id, User newUser)
        {
            await users.ReplaceOneAsync(user => user.Id == id, newUser);
        }

        public async Task<User> AddUser(RegisterForm registerForm)
        {
            User user = new User{
                Username = registerForm.Username,
                Password = registerForm.Password,
                FirstName = registerForm.FirstName,
                LastName = registerForm.LastName,
                CreatedDate = DateTime.Now,
                Rooms = new List<RoomInUserObject>() {},
                Contacts = new List<Contact>() {}
            };
            
            await users.InsertOneAsync(user);
            return user;
        }

        public async Task RemoveUser(string id)
        {
            await users.DeleteOneAsync(u => u.Id == id);
        }
    }
}
