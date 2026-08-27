# Mukies Cookies

Sistema de pedidos para a **Mukies Cookies**, com vitrine de produtos, carrinho, finalizacao via WhatsApp e painel administrativo protegido por JWT.

> Cookies feitos para viciar.

## Funcionalidades

- Cadastro e login de clientes.
- Perfis separados: `User` e `Admin`.
- Vitrine de cookies com busca e carrinho de compras.
- Revisao do pedido com nome do cliente e forma de pagamento (`Pix` ou `Dinheiro`).
- Envio do resumo do pedido para o WhatsApp configurado.
- Painel administrativo para cadastrar, editar e excluir cookies.
- Autenticacao JWT e protecao das operacoes administrativas.
- API documentada com Swagger.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Front-end | React, TypeScript, Vite, React Router, Axios e Lucide Icons |
| Back-end | ASP.NET Core, Entity Framework Core e JWT Bearer |
| Banco de dados | SQL Server / SQL Server Express |

## Estrutura

```text
SistemaMukiesCookies/
|- frontend/                         # Aplicacao React/Vite
|  |- src/
|  |  |- components/                 # Navbar, carrinho e cards
|  |  |- context/                    # Autenticacao e carrinho
|  |  |- pages/                      # Cliente e administracao
|  |  `- services/                   # Cliente HTTP da API
|  `- .env.example
|
`- backend/
   |- Mukies.API/                    # API, controllers e configuracao
   |- Mukies.Domain/                 # Entidades e contratos
   |- Mukies.Services/               # Regras de negocio
   `- Mukies.Infrastructure/         # EF Core, repositorios e migrations
```

## Pre-requisitos

- [.NET SDK 10](https://dotnet.microsoft.com/download)
- Node.js 20 ou superior
- SQL Server Express ou SQL Server Local

## Configuracao

### 1. Front-end

No PowerShell, na raiz do projeto:

```powershell
Copy-Item frontend/.env.example frontend/.env
cd frontend
npm install
```

Edite `frontend/.env`:

```env
# Em desenvolvimento, o Vite encaminha /api para a API local.
VITE_API_URL=/api

# Somente numeros: codigo do pais + DDD + numero.
VITE_ADMIN_WHATSAPP=5511999999999
```

### 2. Back-end

```powershell
Copy-Item backend/Mukies.API/.env.example backend/Mukies.API/.env
```

Edite `backend/Mukies.API/.env` com a sua instancia do SQL Server e uma chave JWT exclusiva:

```env
ConnectionStrings__DefaultConnection=Server=.\SQLEXPRESS;Database=MukiesDb;Trusted_Connection=True;Encrypt=False;TrustServerCertificate=True;

Jwt__Key=UseUmaChaveJWTUnicaComNoMinimo32Bytes
Jwt__Issuer=MukiesAPI
Jwt__Audience=MukiesFrontend
Jwt__ExpirationMinutes=480

# Opcional: cria ou atualiza o administrador na inicializacao da API.
InitialAdmin__Username=admin
InitialAdmin__Password=uma-senha-forte-com-12-ou-mais-caracteres
```

> `Encrypt=False` e recomendado somente para desenvolvimento local com SQL Server Express. Em producao, use uma conexao criptografada e gerenciada por segredo do ambiente.

### 3. Criar o banco de dados

Ainda na raiz do projeto:

```powershell
dotnet ef database update --project backend/Mukies.Infrastructure/Mukies.Infrastructure.csproj --startup-project backend/Mukies.API/Mukies.API.csproj
```

## Executando o sistema

Abra dois terminais.

**Terminal 1 - API**

```powershell
dotnet run --project backend/Mukies.API/Mukies.API.csproj
```

A API inicia em `http://localhost:5080`.

**Terminal 2 - front-end**

```powershell
cd frontend
npm run dev
```

Abra `http://localhost:5173` no navegador.

## Rotas principais da API

| Metodo | Rota | Descricao |
| --- | --- | --- |
| `GET` | `/health` | Verifica se a API esta online |
| `POST` | `/api/Auth/register` | Cria uma conta de cliente |
| `POST` | `/api/Auth/login` | Retorna o token JWT |
| `GET` | `/api/Cookie` | Lista cookies ativos |
| `POST` | `/api/Cookie` | Cria cookie - requer Admin |
| `PUT` | `/api/Cookie/{id}` | Atualiza cookie - requer Admin |
| `DELETE` | `/api/Cookie/{id}` | Desativa cookie - requer Admin |

Com a API em desenvolvimento, a documentacao interativa esta em:

```text
http://localhost:5080/swagger
```

## Autenticacao e perfis

- Contas criadas por `/api/Auth/register` recebem o perfil `User`.
- O administrador inicial e definido pelas variaveis `InitialAdmin__Username` e `InitialAdmin__Password`.
- O token JWT e enviado automaticamente pelo front-end nas requisicoes administrativas.
- Rotas administrativas exigem a role `Admin`.

## Qualidade

Para validar o front-end:

```powershell
cd frontend
npm run build
```

Para validar o back-end:

```powershell
dotnet build backend/Mukies.API/Mukies.API.csproj
```

## Seguranca

- Nunca envie arquivos `.env` para o GitHub.
- Gere uma chave JWT exclusiva para cada ambiente.
- Nao reutilize senhas de desenvolvimento em producao.
- Configure o numero de WhatsApp apenas no `frontend/.env`.

Os arquivos de configuracao local, dependencias e artefatos de build ja estao protegidos pelo `.gitignore`.
