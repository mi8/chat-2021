using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

using ChatApi.Models;
using ChatApi.Repositories;

namespace ChatApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        readonly IAccountRepository accountRepository;

        public AccountController(IAccountRepository accountRepository)
        {
            this.accountRepository = accountRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserListObject>>> GetAll()
        {
            var users = await accountRepository.GetAllUsers();
            return Ok(users);
        }

        [HttpGet("{userId}", Name = "GetUser")]
        public async Task<ActionResult<User>> GetById(string userId){
            var user = await accountRepository.GetUser(userId);
            if (user == null)
                return NotFound(new { message = "Couldn't find the user in the database"});

            return Ok(user);
        }

        [HttpGet("login/{username}")]
        public async Task<ActionResult<User>> Login(string username){
            var user = await accountRepository.GetUserByUsername(username);
            if (user == null)
                return NotFound(new { message = "Couldn't find the user in the database"});

            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult<User>> Create([FromBody] RegisterForm registerForm)
        {
            if(!ModelState.IsValid)
                return BadRequest(new { message = "Register form is not valid"});

            var usernameExist = await accountRepository.GetUserByUsername(registerForm.Username);
            if(usernameExist != null)
                return BadRequest(new { message = "Username is already used"});

            var user = await accountRepository.AddUser(registerForm);
            return CreatedAtRoute("GetUser", new { userId = user.Id.ToString()}, user);
        }
    }
}