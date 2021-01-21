
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using BackEnd.Hub;
using BackEnd.Data;

namespace BackEnd.Controllers
{

    [Route("api/chat")]
    [ApiController]
    // [Authorize]
    public class ChatController : ControllerBase
    {
        protected readonly Context _context;
        private readonly IHubContext<MainHub> _hubContext;
        public ChatController(IHubContext<MainHub> hubContext, Context context)
        {
            _hubContext = hubContext;
            _context = context;
        }

        [Route("get")]
        [HttpGet]
        public IEnumerable<Model> GetMessages()
        {
            var messages = _context.Messages;
            return messages;
        }

        [Route("send")]
        [HttpPost]
        public IActionResult SendRequest([FromBody] Model msg)
        {
            _context.Messages.Add(msg);
            _context.SaveChanges();
            _hubContext.Clients.All.SendAsync("ReceiveOne", msg.user, msg.message, msg.created);
            return Ok(msg);
        }
    }
}