using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using websocket.Hubs;
namespace websocket
{
    public class Startup
    {
       
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
           
        }

        public IConfiguration Configuration { get; }
        string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            
            services.AddRazorPages();
            services.AddSignalR(options =>
            {
                options.EnableDetailedErrors = true;
            });

            services.AddCors(options =>
            {

                options.AddPolicy(name: MyAllowSpecificOrigins,
                                  policy =>
                                  {
                                      policy.AllowAnyOrigin();
                                      //policy.WithOrigins("http://localhost:4150/", "https://localhost:4150/");
                                  });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {

            
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseCors(MyAllowSpecificOrigins);
            ejecutarComando("cmd.exe", "dir");
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
                endpoints.MapHub<MessageHub>("hubs/message");
            });
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
                startInfo.UseShellExecute = true;
                startInfo.WindowStyle = ProcessWindowStyle.Maximized;
                var ruta = @"/C cd " + System.IO.Directory.GetParent(Environment.CurrentDirectory).Parent.Parent + "\\frontend  && ng serve --open --port 4150";
                //startInfo.Arguments = @"/C cd C:\Users\lmolivella\Documents\Freelance\challenge\sia\frontend && ng serve --open --port 4150";
                startInfo.Arguments =ruta; 
                var process = Process.Start(startInfo);
                Thread.Sleep(300);
                return tcs.Task;
            }
            catch (Exception)
            {

                throw;
                //     return tcs;
            }

        }
    }
}
