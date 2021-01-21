using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ChatApi.Hubs;
using ChatApi.Helpers;
using ChatApi.Repositories;
using Microsoft.Extensions.Options;

namespace ChatApi
{
    public class Startup
    {
        public Startup(IWebHostEnvironment env)
        {
            Environment = env;

            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IWebHostEnvironment Environment { get; }
        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var connStr = Configuration.GetConnectionString("DefaultConnection");
            var dbName = Configuration.GetValue<string>("DatabaseName", "");
            services.Configure<DbSettings>(              
                config => { 
                    config.ConnectionString = connStr;
                    config.DatabaseName = dbName;
                }
                );
            services.AddSingleton<IDbSettings>(provider =>
                provider.GetRequiredService<IOptions<DbSettings>>().Value);
            services.AddTransient<IAccountRepository, AccountRepository>();
            services.AddSingleton<IConnectedRepository, ConnectedRepository>();
            services.AddTransient<IUserRepository, UserRepository>();
            services.AddTransient<IPublicRepository, PublicRepository>();
            services.AddTransient<IRoomRepository, RoomRepository>();
            services.AddCors(
                options => {
                    options.AddPolicy("CorsPolicy",
                    builder => builder.AllowAnyMethod()
                            .AllowAnyHeader()
                            .AllowCredentials()
                            .WithOrigins("http://localhost:4200")
                    );}
            );
            services.AddControllers();
            services.AddSignalR();            
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();
            app.UseCors("CorsPolicy");
            app.UseRouting();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ChatHub>("chat");
            });
        }
    }
}
