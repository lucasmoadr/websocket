using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using System.Runtime.InteropServices;
using System.Threading;
using System.Diagnostics;

namespace websocket.Hubs
{
    public class MessageHub:Hub    
    {
        [System.Runtime.InteropServices.DllImport("User32.dll", ExactSpelling = true, CharSet = System.Runtime.InteropServices.CharSet.Auto)]

        private static extern bool MoveWindow(IntPtr hWnd, int x, int y, int cx, int cy, bool repaint);
        [DllImport("user32.dll")]
        public static extern int GetForegroundWindow();


        public const int WM_COMMAND = 0x0112;
        public const int WM_CLOSE = 0xF060;
        public async Task JoinGroup(string groupName, string userName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            await Clients.Group(groupName).SendAsync("newCoordenadas", $"{userName} entró al canal");
        }

        public async Task LeaveGroup(string groupName, string userName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            await Clients.Group(groupName).SendAsync("LeftUser", $"{userName} salió del canal");
        }
        //public async Task SendMessage(int coordenadas)
        //{
        //    await Clients.All.SendAsync("ReceiveMessage", coordenadas);
        //}

        public async Task SendMessage(string idProceso, string CoordenadaX, string CoordenadaY)
        {


            //     ejecutarComando("cmd.exe", "dir");
            if (idProceso != "")
            {
                Process procesoLocal = Process.GetProcessById(Convert.ToInt32(idProceso));
                MoveWindow(procesoLocal.MainWindowHandle, Convert.ToInt32(CoordenadaX), Convert.ToInt32(CoordenadaY), 500, 500, true);
                NewCoordenadas message = new NewCoordenadas(idProceso, CoordenadaX, CoordenadaY, "");
                await Clients.All.SendAsync("newCoordenadas", message);
            }
            else
            {
                
                Process flash = new Process();
                flash.StartInfo.WindowStyle = ProcessWindowStyle.Normal;

                flash.StartInfo.FileName = "notepad.exe";

                flash.Start();
                Thread.Sleep(100);

                int id = flash.Id;
               
                Console.Write(id);
                MoveWindow(flash.MainWindowHandle, Convert.ToInt32(CoordenadaX), Convert.ToInt32(CoordenadaY), 500, 500, true);
                NewCoordenadas message = new NewCoordenadas(id.ToString(), CoordenadaX, CoordenadaY, "");
                await Clients.All.SendAsync("newCoordenadas", message);
            }
         
        }
        static Task<int> ejecutarComando(string programa, string comando)
        {
            var tcs = new TaskCompletionSource<int>();
            try
            {

                ProcessStartInfo startInfo = new ProcessStartInfo();
                string arguments = comando;
                startInfo.FileName = programa;
                startInfo.CreateNoWindow = true;
                startInfo.UseShellExecute = false;
                startInfo.WindowStyle = ProcessWindowStyle.Minimized;
                startInfo.Arguments = @"/C cd C:\Users\lmolivella\Documents\Freelance\challenge\sia\frontend && ng serve --open";
                var process = Process.Start(startInfo);
                return tcs.Task;
            }
            catch (Exception)
            {

                throw;
                //     return tcs;
            }

        }
    }
    public record NewCoordenadas(string idProceso, string x, string y, string GroupName );
}
