using Microsoft.EntityFrameworkCore;
using Tarea6Semana6_API.Models;
using System;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var cs = builder.Configuration.GetConnectionString("Default");
builder.Services.AddDbContext<AppDbContext>(
    options => {
        options.UseMySQL(cs,
    mySqlOptions =>
    {
        mySqlOptions.MigrationsHistoryTable("__EFMigrationsHistory");

    });

    });
const string CorsPolicyName = "AllowAll";

builder.Services.AddCors(options =>

{
    options.AddPolicy(CorsPolicyName, policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();
app.UseCors(CorsPolicyName);

app.MapControllers();

app.Run();
