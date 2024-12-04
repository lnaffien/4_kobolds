using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using N2I.DAL;

namespace backend;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Identity
        builder.Services.AddAuthorization();
        builder.Services.AddIdentityApiEndpoints<IdentityUser>()
            .AddEntityFrameworkStores<ApplicationDbContext>();


        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddControllers();

        // Infrastructure
        builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseInMemoryDatabase("AppDb")); // For the moment, we use an in-memory database before switching to a real one




        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();

        // Identity
        app.MapIdentityApi<IdentityUser>();
        app.MapSwagger().RequireAuthorization();

        app.Run();
    }
}