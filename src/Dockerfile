FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["Blog.API/Blog.API.csproj", "Blog.API/"]
RUN dotnet restore "Blog.API/Blog.API.csproj"
COPY . .
WORKDIR "/src/Blog.API"
RUN dotnet build "Blog.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Blog.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Blog.API.dll"]