# ===========================================
# 1️⃣ BUILD STAGE
# ===========================================
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Cài Node.js 20
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Copy toàn bộ source
COPY . .

# Restore .NET
RUN dotnet restore "./src/Web/Web.csproj"

# Build Tailwind / Frontend
WORKDIR /src/src/Web/ClientApp
RUN npm install
RUN npx tailwindcss -i ./src/input.css -o ./src/output.css --minify

# Publish Web project
WORKDIR /src
RUN dotnet publish "./src/Web/Web.csproj" -c Release -o /app/publish

# ===========================================
# 2️⃣ RUNTIME STAGE
# ===========================================
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "MyBlog.Web.dll"]
