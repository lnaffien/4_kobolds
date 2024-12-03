using backend.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace N2I.Controllers;

[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase, ICrudController<WeatherForecast>
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    [HttpGet]
    public ActionResult<IEnumerable<WeatherForecast>> Get()
    {
        Console.WriteLine("Fetching weather forecasts");
        var rng = new Random();
        return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        {
            Date = DateTime.Now.AddDays(index),
            TemperatureC = rng.Next(-20, 55),
            Summary = Summaries[rng.Next(Summaries.Length)]
        })
        .ToArray();
    }

    [HttpGet("{id}")]
    public ActionResult<WeatherForecast> Get(int id)
    {
        Console.WriteLine($"Fetching weather forecast with id: {id}");
        var rng = new Random();
        return new WeatherForecast
        {
            Date = DateTime.Now.AddDays(id),
            TemperatureC = rng.Next(-20, 55),
            Summary = Summaries[rng.Next(Summaries.Length)]
        };
    }

    [HttpPost]
    public ActionResult<WeatherForecast> Post(WeatherForecast weatherForecast)
    {
        Console.WriteLine("Creating new weather forecast");
        return weatherForecast;
    }

    [HttpPut("{id}")]
    public ActionResult<WeatherForecast> Put(int id, WeatherForecast weatherForecast)
    {
        Console.WriteLine($"Updating weather forecast with id: {id}");
        return weatherForecast;
    }

    [HttpDelete("{id}")]
    public ActionResult Delete(int id)
    {
        Console.WriteLine($"Deleting weather forecast with id: {id}");
        return Ok();
    }
}