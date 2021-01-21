using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using ChatApi.Helpers;
using ChatApi.Hubs;
using ChatApi.Models;
using ChatApi.Repositories;
using System.Threading.Tasks;
using System.Linq;

namespace ChatApi.Controllers
{
    [Route("api/chat/private")]
    [ApiController]
    public class UserController : ControllerBase
    {
        readonly IHubContext<ChatHub> hubContext;
        readonly IPublicRepository publicRepository;
        readonly IRoomRepository roomRepository;
        readonly IUserRepository userRepository;
        readonly IAccountRepository accountRepository;
        readonly IConnectedRepository userConnectedRepository;

        public UserController(IHubContext<ChatHub> hubContext, IPublicRepository publicRepository, IRoomRepository roomRepository, IUserRepository userRepository, IAccountRepository accountRepository, IConnectedRepository userConnectedRepository)
        {
            this.hubContext = hubContext;
            this.publicRepository = publicRepository;
            this.roomRepository = roomRepository;
            this.userRepository = userRepository;
            this.accountRepository = accountRepository;
            this.userConnectedRepository = userConnectedRepository;
        }

        [HttpGet("{userId}/contacts/{contactId}", Name = "GetContact")]
        public async Task<ActionResult<Contact>> GetContact(string userId, string contactId)
        {
            var user = await accountRepository.GetUser(userId);
            if (user == null)
                return NotFound(new { message = "Couldn't find the user in the database"});
            var contact = user.Contacts.Find(c => c.ContactId == contactId);
            if (contact == null)
                return NotFound(new { message = "Couldn't find the contact in the database"});
            return Ok(contact);
        }

        [Route("{userId}/new")]
        [HttpPost]
        public async Task<ActionResult<Contact>> CreateContact(string userId, [FromBody] NewContactForm newContact)
        {
            if(!ModelState.IsValid)
                return BadRequest(new { message = "Contact form is not valid"});
                
            var contactValid = await accountRepository.GetUser(newContact.ContactId);
            if (contactValid == null)
                return BadRequest(new { message = "Cannot find the contact in the database"});
            var senderDocument = await accountRepository.GetUser(userId);
            if (senderDocument == null)
                return BadRequest(new { message = "Cannot find the user in the database"});

            if (senderDocument.Contacts.Any(c => c.ContactId == newContact.ContactId))
                return BadRequest(new { message = "Cannot add a contact twice"});

            var senderConnection = await userConnectedRepository.GetConnectedUserByUserId(userId);
            if(senderConnection == null)
                return BadRequest(new { message = "Verify your connection to the SignalR Hub"});
            var senderConnectionId = senderConnection.ConnectionId;

            var senderUpdatedDocument = await userRepository.AddContactToUser(userId, newContact.ContactId, newContact.ContactName);
            if (senderUpdatedDocument == null)
                return NotFound(new { message = "Contact was not added to the database"});

            var newSenderContact = senderUpdatedDocument.Contacts.Find(c => c.ContactId == newContact.ContactId);
            if (newSenderContact == null)
                return NotFound(new { message = "Couldn't find the new contact in the database"});
            
            var receiverUpdatedDocument = await userRepository.AddContactToUser(newContact.ContactId, userId, newContact.Username);
            if (receiverUpdatedDocument == null)
                return NotFound(new { message = "Contact was not added to the database"});

            var newReceiverContact = receiverUpdatedDocument.Contacts.Find(c => c.ContactId == userId);
            if (newReceiverContact == null)
                return NotFound(new { message = "Couldn't find the new contact in the database"});
            
            var receiverConnection = await userConnectedRepository.GetConnectedUserByUserId(newContact.ContactId);
            if(receiverConnection == null)
            {
                await hubContext.Clients.Client(senderConnectionId).SendAsync(KeyConstants.addedContactOffline, newSenderContact);
                return CreatedAtRoute("GetContact", new { userId = userId.ToString(), contactId = newSenderContact.ContactId}, newSenderContact);
            }
            var receiverConnectionId = receiverConnection.ConnectionId;
            await hubContext.Clients.Client(senderConnectionId).SendAsync(KeyConstants.receiveNewContact, newSenderContact);
            await hubContext.Clients.Client(receiverConnectionId).SendAsync(KeyConstants.receiveNewContact, newReceiverContact);
            return CreatedAtRoute("GetContact", new { userId = userId.ToString(), contactId = newSenderContact.ContactId}, newSenderContact);
        }

        [HttpGet("{userId}/contacts/{contactId}/messages/{messageId}", Name = "GetContactMessage")]
        public async Task<ActionResult<Message>> GetContactMessage(string userId, string contactId, string messageId)
        {
            var user = await accountRepository.GetUser(userId);
            if (user == null)
                return NotFound(new { message = "Couldn't find the user in the database"});
            var contact = user.Contacts.Find(c => c.ContactId == contactId);
            if (contact == null)
                return NotFound(new { message = "Couldn't find the contact in the database"});
            var message = contact.Messages.Find(m => m.Id == messageId);
            if (message == null)
                return NotFound(new { message = "Couldn't find the message in the database"});
            return Ok(message);
        }

        [Route("{receiverId}/send")]
        [HttpPost]
        public async Task<ActionResult<Message>> SendPrivateMessage(string receiverId, [FromBody] MessageSentForm sentMessage)
        {
            if(!ModelState.IsValid)
                return BadRequest(new { message = "Message form is not valid"});

            var contactValid = await accountRepository.GetUser(receiverId);
            if (contactValid == null)
                return BadRequest(new { message = "Cannot find the contact in the database"});
            var senderDocument = await accountRepository.GetUser(sentMessage.SenderId);
            if (senderDocument == null)
                return BadRequest(new { message = "Cannot find the user in the database"});

            var senderConnection = await userConnectedRepository.GetConnectedUserByUserId(sentMessage.SenderId);
            if(senderConnection == null)
                return BadRequest(new { message = "Verify your connection to the SignalR Hub"});
            var senderConnectionId = senderConnection.ConnectionId;

            var updatedSender = await userRepository.AddPrivateMessageToContact(sentMessage.SenderId, receiverId, sentMessage);
            if (updatedSender == null)
                return NotFound(new { message = "Private message was not added to the database"});

            var newSenderPrivateMessage = updatedSender.Contacts.Find(c => c.ContactId == receiverId).Messages.Find(m => m.SenderName == sentMessage.SenderName && m.Content == sentMessage.Content);
            if (newSenderPrivateMessage == null)
                return NotFound(new { message = "Couldn't find the new private message in the database"});

            var updatedReceiver = await userRepository.AddPrivateMessageToContact(receiverId, sentMessage.SenderId, sentMessage);
            if (updatedReceiver == null)
                return NotFound(new { message = "Private message was not added to the database"});

            var newReceiverPrivateMessage = updatedReceiver.Contacts.Find(c => c.ContactId == sentMessage.SenderId).Messages.Find(m => m.SenderName == sentMessage.SenderName && m.Content == sentMessage.Content);
            if (newReceiverPrivateMessage == null)
                return NotFound(new { message = "Couldn't find the new private message in the database"});

            var receiverConnection = await userConnectedRepository.GetConnectedUserByUserId(receiverId);
            if(receiverConnection == null)
            {
                await hubContext.Clients.Client(senderConnectionId).SendAsync(KeyConstants.addedPrivateMessageOffline, newSenderPrivateMessage, receiverId);
                return CreatedAtRoute("GetContactMessage", new { userId = sentMessage.SenderId.ToString(), contactId = receiverId, messageId = newSenderPrivateMessage.Id}, newSenderPrivateMessage);
            }
            var receiverConnectionId = receiverConnection.ConnectionId;

            await hubContext.Clients.Client(senderConnectionId).SendAsync(KeyConstants.receiveNewPrivateMessage, newSenderPrivateMessage, receiverId);
            await hubContext.Clients.Client(receiverConnectionId).SendAsync(KeyConstants.receiveNewPrivateMessage, newReceiverPrivateMessage, sentMessage.SenderId);
            return CreatedAtRoute("GetContactMessage", new { userId = sentMessage.SenderId.ToString(), contactId = receiverId, messageId = newSenderPrivateMessage.Id}, newSenderPrivateMessage);
        }
    }
}