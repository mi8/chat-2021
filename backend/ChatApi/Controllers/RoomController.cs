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
    public class RoomController : ControllerBase
    {
        readonly IHubContext<ChatHub> hubContext;
        readonly IRoomRepository roomRepository;
        readonly IAccountRepository accountRepository;
        readonly IUserRepository userRepository;
        readonly IConnectedRepository userConnectedRepository;

        public RoomController(IHubContext<ChatHub> hubContext, IRoomRepository roomRepository, IAccountRepository accountRepository, IUserRepository userRepository, IConnectedRepository userConnectedRepository)
        {
            this.hubContext = hubContext;
            this.roomRepository = roomRepository;
            this.accountRepository = accountRepository;
            this.userRepository = userRepository;
            this.userConnectedRepository = userConnectedRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomListObject>>> GetAll()
        {
            var rooms = await roomRepository.GetAllRooms();
            return Ok(rooms);
        }

        [HttpGet("{roomId}", Name = "GetRoom")]
        public async Task<ActionResult<Room>> GetById(string roomId){
            var room = await roomRepository.GetRoom(roomId);
            if (room == null)
                return NotFound(new { message = "Couldn't find the room in the database"});

            return Ok(room);
        }

        [HttpGet("{roomId}/{roomMessageId}", Name = "GetRoomMessage")]
        public async Task<ActionResult<Message>> GetRoomMessageById(string roomId, string roomMessageId)
        {
            var roomMessage = await roomRepository.GetRoomMessage(roomId, roomMessageId);
            if (roomMessage == null)
                return NotFound(new { message = "Couldn't find the room message in the database"});
            return Ok(roomMessage);
        }

        [Route("new")]
        [HttpPost]
        public async Task<ActionResult<Room>> CreateRoom([FromBody] NewRoomForm roomForm)
        {
            if(!ModelState.IsValid)
                return BadRequest(new { message = "Room form is not valid"});

            var groupNameExist = await roomRepository.GetRoomByRoomName(roomForm.RoomName);
            if(groupNameExist != null)
                return BadRequest(new { message = "Group Name is already used"});

            var room = await roomRepository.AddRoom(roomForm);
            await hubContext.Clients.All.SendAsync(KeyConstants.receiveNewRoom, room);
            return CreatedAtRoute("GetRoom", new { roomId = room.Id.ToString()}, room);
        }
        
        [Route("{roomId}/join")]
        [HttpPost]
        public async Task<IActionResult> JoinGroup(string roomId, JoinRoomForm joinRoomForm)
        {
            var user = await accountRepository.GetUser(joinRoomForm.UserId);
            if(user == null)
                return BadRequest(new { message = "Couldn't find the user in the database" });
            var roomExist = user.Rooms.Find(r => r.Id == roomId);
            if(roomExist != null)
                return BadRequest(new { message = "Cannot join the group twice"});

            var newJoinRoom = await userRepository.AddRoomToUser(joinRoomForm.UserId, roomId, joinRoomForm.RoomName);
            await roomRepository.AddUserToRoom(roomId, joinRoomForm.UserId, joinRoomForm.Username);

            var senderConnection = await userConnectedRepository.GetConnectedUserByUserId(joinRoomForm.UserId);
            await hubContext.Groups.AddToGroupAsync(senderConnection.ConnectionId, joinRoomForm.RoomName);
            await hubContext.Clients.Client(senderConnection.ConnectionId).SendAsync(KeyConstants.joinRoomSuccess, newJoinRoom);
            await hubContext.Clients.Group(joinRoomForm.RoomName).SendAsync(KeyConstants.newJoinRoom, senderConnection.ConnectionId, joinRoomForm.UserId);
            return NoContent();
        }

        [Route("{roomId}/send")]
        [HttpPost]
        public async Task<ActionResult<Message>> SendGroupMessage(string roomId, [FromBody] MessageSentForm sentMessage)
        {
            if(!ModelState.IsValid)
                return BadRequest(new { message = "Message form is not valid"});

            var room = await roomRepository.GetRoom(roomId);
            if (room == null)
                return NotFound(new { message = "Couldn't find the room in the database"});

            await hubContext.Clients.Group(room.RoomName).SendAsync(KeyConstants.receiveNewRoomMessage, sentMessage, roomId);
            
            var updatedRoom = await roomRepository.AddMessageToRoom(roomId, sentMessage);
            var newMessage = updatedRoom.RoomMessages.Find(m => m.Content == sentMessage.Content && m.SenderName == sentMessage.SenderName);
            if (newMessage == null)
                return NotFound(new { message = "Couldn't find the new room message in the database"});                      
            
            return CreatedAtRoute("GetRoomMessage", new { roomId = updatedRoom.Id.ToString(), roomMessageId = newMessage.Id.ToString() }, newMessage);         
        }

        [Route("{roomId}/{userId}/quit")]
        [HttpPost]
        public async Task<IActionResult> QuitGroup(string roomId, string userId)
        {
            var user = await accountRepository.GetUser(userId);
            if(user == null)
                return BadRequest(new { message = "Couldn't find the user in the database" });
            var roomExist = user.Rooms.Find(r => r.RoomId == roomId);
            if(roomExist != null)
            {
                await userRepository.RemoveRoomFromUser(userId, roomId);
                await roomRepository.RemoveUserFromRoom(roomId, userId);
                
                var senderConnection = await userConnectedRepository.GetConnectedUserByUserId(userId);
                await hubContext.Groups.RemoveFromGroupAsync(senderConnection.ConnectionId, roomExist.RoomName);
                await hubContext.Clients.Client(senderConnection.ConnectionId).SendAsync(KeyConstants.quitRoomSuccess, roomId);
                await hubContext.Clients.Group(roomExist.RoomName).SendAsync(KeyConstants.newQuitRoom, senderConnection.ConnectionId, userId);
                return NoContent();
            }           
            return BadRequest(new { message = "Cannot quit the group"});
        }
    }
}