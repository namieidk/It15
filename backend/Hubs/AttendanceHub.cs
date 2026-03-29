using Microsoft.AspNetCore.SignalR;

namespace YourProject.Hubs
{
    public class AttendanceHub : Hub
    {
        public async Task JoinDepartmentGroup(string department)
        {
            if (!string.IsNullOrEmpty(department))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, department);
                Console.WriteLine($"[SignalR] Connection {Context.ConnectionId} joined group: {department}");
            }
        }

        public async Task LeaveDepartmentGroup(string department)
        {
            if (!string.IsNullOrEmpty(department))
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, department);
            }
        }
    }
}