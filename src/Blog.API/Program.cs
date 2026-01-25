using System.Security.Claims;
using Blog.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

Console.WriteLine($"Environment: {builder.Environment.EnvironmentName}");
Console.WriteLine($"ASPNETCORE_ENVIRONMENT env var: {Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")}");
Console.WriteLine($"ConnectionString from config: {builder.Configuration.GetConnectionString("Database")}");

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

var keycloakAuthority = builder.Configuration["Keycloak:Authority"]!;
var keycloakAudience = builder.Configuration["Keycloak:Audience"]!;
var keycloakMetadataAddress = builder.Configuration["Keycloak:MetadataAddress"];

// Detect if running in Docker by checking if we can resolve 'keycloak' hostname
// If MetadataAddress is not set and we're in Docker, use the internal Docker network URL
if (string.IsNullOrEmpty(keycloakMetadataAddress))
{
    try
    {
        System.Net.Dns.GetHostEntry("keycloak");
        keycloakMetadataAddress = "http://keycloak:8080/realms/blog/.well-known/openid-configuration";
        Console.WriteLine("Detected Docker environment, using internal keycloak hostname");
    }
    catch (System.Net.Sockets.SocketException)
    {
        // Not in Docker, keycloak hostname doesn't resolve
        Console.WriteLine("Not in Docker environment, using localhost");
    }
}

Console.WriteLine($"Keycloak Authority: {keycloakAuthority}");
Console.WriteLine($"Keycloak MetadataAddress: {keycloakMetadataAddress ?? "(not set, using Authority)"}");


builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new()
    {
        Title = "Medium Clone API",
        Version = "v1",
        Description = "A blogging platform API built with Clean Architecture",
        Contact = new()
        {
            Name = "Your Name",
            Email = "your.email@example.com"
        }
    });

    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.OAuth2,
        Flows = new OpenApiOAuthFlows
        {
            AuthorizationCode = new OpenApiOAuthFlow
            {
                AuthorizationUrl = new Uri($"{keycloakAuthority}/protocol/openid-connect/auth"),
                TokenUrl = new Uri($"{keycloakAuthority}/protocol/openid-connect/token"),
                Scopes = new Dictionary<string, string>
                {
                    { "openid", "OpenID Connect" },
                    { "profile", "User profile" },
                    { "email", "User email" }
                }
            }
        }
    });

    options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        [new OpenApiSecuritySchemeReference("oauth2", document)] = ["openid", "profile", "email"]
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = keycloakAuthority;
        options.Audience = keycloakAudience;
        options.RequireHttpsMetadata = builder.Configuration.GetValue<bool>("Keycloak:RequireHttpsMetadata");

        // Use separate metadata address for Docker networking (backchannel)
        // while validating against the public issuer URL
        if (!string.IsNullOrEmpty(keycloakMetadataAddress))
        {
            options.MetadataAddress = keycloakMetadataAddress;
        }

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = keycloakAuthority,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidAudiences = [keycloakAudience, "account"],
            NameClaimType = ClaimTypes.Name,
            RoleClaimType = ClaimTypes.Role
        };

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"Authentication failed: {context.Exception}");
                return Task.CompletedTask;
            },
            OnMessageReceived = context =>
            {
                Console.WriteLine($"Token received");
                Console.WriteLine($"  Authority: {context.Options.Authority}");
                Console.WriteLine($"  MetadataAddress: {context.Options.MetadataAddress}");
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Medium Clone API v1");
        options.RoutePrefix = string.Empty;
        options.OAuthClientId(keycloakAudience);
        options.OAuthUsePkce();
    });
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

// Map Controllers
app.MapControllers();

app.Run();
