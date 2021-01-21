using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;
using ChatApi.Models;
using ChatApi.Repositories;
using ChatApi.Helpers;

namespace ChatApi.Hubs
{
    public class ChatHub : Hub
    {
        readonly IConnectedRepository userConnectedRepository;
        readonly IAccountRepository accountRepository;
        public ChatHub(IConnectedRepository userConnectedRepository, IAccountRepository accountRepository)
        {
            this.userConnectedRepository = userConnectedRepository;
            this.accountRepository = accountRepository;
        }
        public string GetConnectionId(){
            return Context.ConnectionId;
        }

        public override async Task OnConnectedAsync()
        {
            var connectionId = GetConnectionId();
            var userId = Context.GetHttpContext().Request.Query["userId"];
                       
            var checkIfExists = await userConnectedRepository.GetConnectedUserByUserId(userId);
            if(checkIfExists != null)
            {
                await userConnectedRepository.UpdateUserByUserId(userId, connectionId);
                var updatedConnectedUser = await userConnectedRepository.GetConnectedUserByUserId(userId);
                await Clients.All.SendAsync(KeyConstants.updatedConnectedUser, updatedConnectedUser);
            }
            else
                await userConnectedRepository.AddUser(userId, connectionId);

            var connectedUserObject = await accountRepository.GetUser(userId);
            var roomList = connectedUserObject.Rooms;
            foreach(var room in roomList)
            {
                await Groups.AddToGroupAsync(connectionId, room.RoomName);
            }
                       
            var userConnectedList = await userConnectedRepository.GetAllConnectedUsers();
            await Clients.Caller.SendAsync(KeyConstants.userConnectedList, userConnectedList);
            var connectedUser = await userConnectedRepository.GetConnectedUserByUserId(userId);
            await Clients.All.SendAsync(KeyConstants.newConnectedUser, connectedUser);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
            var connectionId = GetConnectionId();
            var userId = Context.GetHttpContext().Request.Query["userId"];

            UserConnected newDisconnection = new UserConnected {
                Id = userId,
                ConnectionId = connectionId
            };
            await userConnectedRepository.RemoveUserByUserId(userId);         
            await Clients.All.SendAsync(KeyConstants.newDisconnectedUser, newDisconnection);
            
            await base.OnDisconnectedAsync(ex);
        } 
    }
}