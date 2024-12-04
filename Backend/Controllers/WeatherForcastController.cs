using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace N2I.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase, ICrudController<WeatherForecast>
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    [HttpGet]
    public async Task<ActionResult<IEnumerable<WeatherForecast>>> Get()
    {
        await Task.Run(() => Console.WriteLine("Fetching weather forecasts"));
        var rng = new Random();
        return Ok(Enumerable.Range(1, 5).Select(index => new WeatherForecast
        {
            Date = DateTime.Now.AddDays(index),
            TemperatureC = rng.Next(-20, 55),
            Summary = Summaries[rng.Next(Summaries.Length)]
        })
        .ToArray());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WeatherForecast>> Get(int id)
    {
        await Task.Run(() => Console.WriteLine($"Fetching weather forecast with id: {id}"));
        var rng = new Random();
        return Ok(new WeatherForecast
        {
            Date = DateTime.Now.AddDays(id),
            TemperatureC = rng.Next(-20, 55),
            Summary = Summaries[rng.Next(Summaries.Length)]
        });
    }

    [HttpPost]
    public async Task<ActionResult<WeatherForecast>> Post([FromBody] WeatherForecast weatherForecast)
    {
        await Task.Run(() => Console.WriteLine("Creating new weather forecast"));
        await Task.Run(() => Console.WriteLine($"New weather forecast: {weatherForecast}"));
        return Ok(weatherForecast);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<WeatherForecast>> Put(int id, [FromBody] WeatherForecast weatherForecast)
    {
        await Task.Run(() => Console.WriteLine($"Updating weather forecast with id: {id}"));
        await Task.Run(() => Console.WriteLine($"Updated weather forecast: {weatherForecast}"));
        return Ok(weatherForecast);
    }

    [HttpPatch("{id}")]
    public async Task<ActionResult<WeatherForecast>> Patch(int id, [FromBody] WeatherForecast weatherForecast)
    {
        // This is a dummy implementation, in a real-world scenario you would update only the fields that were sent
        // so for now it is the same as the PUT method
        await Task.Run(() => Console.WriteLine($"Patching weather forecast with id: {id}"));
        await Task.Run(() => Console.WriteLine($"Updated weather forecast: {weatherForecast} (only updated fields)"));
        return Ok(weatherForecast);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        await Task.Run(() => Console.WriteLine($"Deleting weather forecast with id: {id}"));
        return Ok();
    }
}