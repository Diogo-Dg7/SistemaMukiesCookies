# Imagem de compilacao da API .NET
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY backend/Mukies.Domain/Mukies.Domain.csproj backend/Mukies.Domain/
COPY backend/Mukies.Services/Mukies.Services.csproj backend/Mukies.Services/
COPY backend/Mukies.Infrastructure/Mukies.Infrastructure.csproj backend/Mukies.Infrastructure/
COPY backend/Mukies.API/Mukies.API.csproj backend/Mukies.API/

RUN dotnet restore backend/Mukies.API/Mukies.API.csproj

COPY backend/ backend/
RUN dotnet publish backend/Mukies.API/Mukies.API.csproj -c Release -o /app/publish /p:UseAppHost=false

# Imagem menor, usada em producao pelo Render
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://0.0.0.0:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "Mukies.API.dll"]
