using BackEnd.Models;

namespace BackEnd.Profile
{
    public class AutoMapperProfile : AutoMapper.Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserModel>();
            CreateMap<RegisterModel, User>();
            CreateMap<UserModel, User>();
            CreateMap<Task, TaskModel>();
        }
    }
}