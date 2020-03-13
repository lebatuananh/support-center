#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["Dvg.SupportCenter.Webapp/Dvg.SupportCenter.Webapp.csproj", "Dvg.SupportCenter.Webapp/"]
RUN dotnet restore "Dvg.SupportCenter.Webapp/Dvg.SupportCenter.Webapp.csproj"
COPY . .
WORKDIR "/src/Dvg.SupportCenter.Webapp"
RUN dotnet build "Dvg.SupportCenter.Webapp.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Dvg.SupportCenter.Webapp.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Dvg.SupportCenter.Webapp.dll"]