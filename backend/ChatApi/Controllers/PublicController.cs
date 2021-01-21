using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

using ChatApi.Models;
using ChatApi.Repositories;
using Microsoft.AspNetCore.SignalR;
using ChatApi.Hubs;
using ChatApi.Helpers;

namespace ChatApi.Controllers
{
    [Route("api/chat/[controller]")]
    [ApiController]
    public class PublicController : ControllerBase
    {
        readonly IHubContext<ChatHub> hubContext;
        readonly IPublicRepository publicRepository;

        public PublicController(IHubContext<ChatHub> hubContext, IPublicRepository publicRepository)
        {
            this.hubContext = hubContext;
            this.publicRepository = publicRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Message>>> GetAll()
        {
            var messages = await publicRepository.GetPublicMessages();
            return Ok(messages);
        }

        [HttpGet("{id}", Name = "GetMessage")]
        public async Task<ActionResult<Message>> GetById(string id){
            var message = await publicRepository.GetMessage(id);
            if (message == null)
                return NotFound(new { message = "Couldn't find the message in the database"});

            return Ok(message);
        }

        [Route("send")]
        [HttpPost]
        public async Task<ActionResult<Message>> SendPublicMessage([FromBody] MessageSentForm newMessage)
        {       
            if(!ModelState.IsValid)
                return BadRequest(new { message = "Message form is not valid"});
            
            var messageToDb = await publicRepository.AddPublicMessage(newMessage);
            if(messageToDb == null)
                return NotFound(new { message = "Public message was not added to the database"});
            
            await hubContext.Clients.All.SendAsync(KeyConstants.receiveNewPublicMessage, newMessage);
            return CreatedAtRoute("GetMessage", new { id = messageToDb.Id.ToString()}, messageToDb);
        }       
    }
}