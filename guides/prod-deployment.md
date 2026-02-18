# liiive Production Deployment

This guide describes how to deploy liiive in a production environment on a Linux server using Docker. It is intended for system administrators who want to self-host liiive for institutional or public use. This guide assumes familiarity with:

- Linux server administration basics
- Docker and Docker Compose
- Networking fundamentals (ports, DNS, firewalls)

liiive consists of multiple containerized services:

- Supabase (database, authentication, API gateway)
- Supabase Studio (administration UI)
- liiive realtime WebSocket server
- liiive client application
- Traefik reverse proxy

## 1. Prerequisites

Before you begin, make sure you have the following available in your production environment:

- Linux server (tested on Ubuntu 22.04 LTS)
- Root or sudo access on the server
- Docker 24.0+ and Docker Compose 2.x

### 1.1 Hardware Requirements

| Resource | Minimum   | Recommended |
|----------|-----------|-------------|
| RAM      | 4 GB      | 8 GB+       |
| CPU      | 2 cores   | 4 cores+    |
| Disk     | 50 GB SSD | 80 GB+ SSD  |

### 1.2 DNS Configuration

You also need a domain name for your server (e.g. `my-liiive.org`), and several subdomains where each externally accessible service can live.

Create the following **public DNS A records**, all pointing to the public IPv4 address of your server:

| Subdomain (Example)    | Type | Purpose                        |
|------------------------|------|--------------------------------|
| `app.my-liiive.org`    | A    | liiive frontend                |
| `ws.my-liiive.org`     | A    | liiive WebSocket server        |
| `api.my-liiive.org`    | A    | Supabase API gateway           |
| `studio.my-liiive.org` | A    | Supabase Studio admin UI       |

The remainder of this guide assumes that all DNS records are already in place and resolve correctly before deployment.

> [!WARNING]
> Supabase Studio provides full administrative access to the backend. Although access to Supabase Studio is protected by HTTP Basic authentication, it is **strongly recommended that you block outside access to Studio** by your own firewall rules / according to your institution’s security policies, so that it is only reachable from your intranet, but not the public web.

### 1.3 Optional: Testing a Production Setup Locally

Before deploying to an actual production server, you can also simulate a production environment locally. Because the production deployment strictly requires subdomains, you have to "fake" subdomains that point to localhost. This allows you to preview the multi-subdomain setup without configuring actual DNS records.

**On Linux/macOS:**

1. Edit the hosts file with sudo privileges:

   ```sh
   sudo nano /etc/hosts
   ````

2. Add the following lines:

   ```sh
   127.0.0.1  app.liiive.local
   127.0.0.1  ws.liiive.local
   127.0.0.1  api.liiive.local
   127.0.0.1  studio.liiive.local
   ```

3. Save and exit (in nano: Ctrl+O, Enter, Ctrl+X)

After editing the hosts file, you can use these local subdomains (e.g., app.liiive.local) in your configuration files instead of the production domain names. Your browser will treat them like real subdomains, but they'll resolve to localhost.

> [!IMPORTANT]
> The local production preview setup runs **over plain HTTP, not HTTPS**. This requires a modified Traefik reverse proxy configuration (see Step 3). For convenience, this repository includes a dedicated HTTP preview configuration and startup script: `start-preview.sh`. You must use this script later in **Step 4** instead of `start-prod.sh`.

## 2. Configuration

In this section, you will configure each service in the order they are required. Supabase must be configured first, as both the liiive server and client depend on its credentials and endpoints.

## 2.1 Supabase Configuration

1. Change into the `supabase/docker` folder:

   ```sh
   cd supabase/docker
   ```

2. Create a local environment file:

   ```sh
   cp .env.example .env
   ```

3. Configure Supabase by editing `.env`:
   - Follow the [official Supabase self-hosting guide](https://supabase.com/docs/guides/self-hosting/docker#configuring-and-securing-supabase) to configure database passwords, JWT secrets, and API keys.
   - Some of these values will be required by the liiive server and client in later steps.

4. Pull the required Supabase Docker images:

   ```sh 
   docker compose pull
   ```

> [!WARNING]
> Make sure to set secure values for all JWT secrets, database passwords, and API keys. Do not reuse secrets from a development environment. Generate new credentials for production.

## 2.2 liiive Server Configuration

1. Change into the `liiive-server` directory:
   
   ```sh
   cd ../../liiive-server
   ```

2. Create a local environment file:

   ```sh
   cp .env.example .env
   ```

3. Update the following values in `.env`:
   - For a standard deployment, keep the default `SUPABASE_URL` value of `http://kong:8000`. This hostname refers to the Supabase API gateway container in the internal Docker network and is not publicly accessible.
   - Set `SUPABASE_SERVICE_ROLE_KEY` to the value of `SERVICE_ROLE_KEY` from your Supabase `.env` file created in step 2.1. 

> [!WARNING]
> The Supabase service key grants full database access and must never be exposed publicly!

### 2.3 liiive Client Configuration

1. Change into the `liiive-client` directory:
   
   ```sh
   cd ../liiive-client
   ```

2. Create a local environment file:

   ```sh
   cp .env.example .env
   ```

3. Update the following values in `.env`:
  - `PUBLIC_SUPABASE_URL` 
    Public HTTPS URL of the Supabase API gateway, e.g. `https://api.my-liiive.org`.
  - `PUBLIC_SUPABASE_API_KEY`
    Supabase anonymous key (`ANON_KEY`) from your Supabase `.env` file.
  - `SUPABASE_SECRET_SERVICE_API_KEY` 
    Supabase service role key (`SERVICE_ROLE_KEY`).
  - `PUBLIC_HOCUSPOCUS_URL`
    Public URL of the liiive realtime server, e.g. `https://ws.my-liiive.org`

## 3. Traefik Reverse Proxy Configuration

The production deployment uses Traefik as a reverse proxy to route incoming requests based on hostnames. HTTPS is automatically handled via [Let's Encrypt](https://letsencrypt.org/). Traefik also provides HTTP Basic Authentication for the Supabase Studio dashboard. 

1. Change into the `traefik` directory:

   ```sh 
   cd ../traefik
   ```

2. Create a local environment file:

   ```sh
   cp .env.example .env
   ```

3. Edit `.env` to set your domain names and Let's Encrypt contact email.

4. Edit `.env` to set a secure username and password for Studio access. Default credentials (liiive / liiive) are provided for convenience but **must be replaced before going into production**. To generate your own credentials, run:

   ```sh
   htpasswd -nbB yourusername yourpassword | sed 's/\$/\$\$/g'
   ```

   Then paste the output as the value of `STUDIO_AUTH`.

> [!IMPORTANT]
> Make sure the domains and subdomains match your public DNS A records. Traefik will automatically request TLS certificates from Let’s Encrypt for these domains.

## 4. Start Services

1. Change back to the project root directory:

   ```sh
   cd ..
   ```

2. Start the production deployment. This step may take a while, as Docker images are built and initialized.

   ```sh
   ./start-prod.sh
   ```

> [!NOTE]
> For HTTP-only local preview setups (Step 1.3), use `./start-preview.sh` instead of `./start-prod.sh`.

Verify that everything started correctly:

- **liiive Client**
  Open <http://app.my-liiive.org> in your browser. You should see the liiive start page.

- **Supabase API gateway and Studio**
  Open <http://studio.my-liiive.org> in your browser. You should see the Supabase Studio login prompt. Use the credentials defined by `DASHBOARD_USERNAME` and `DASHBOARD_PASSWORD` in your Supabase `.env` file.

## 5. Database Initialization

With all services running, initialize the liiive database schema.

1. Change into the initialization directory:

   ```sh 
   cd supabase/init
   ```

2. Run the database initialization script:

   ```sh
   ./init-db.sh
   ```

3. Verify in Supabase Studio that the database schema has been created successfully.

This step only needs to be performed once for a fresh deployment.

## 6. Social Login

liiive supports social login via GitHub and Google. Configuration involves minor changes in the Supabase backend configuration, as well as setup steps in your GitHub and Google accounts. 

Full social login configuration information is available here: [social login configuration](social-login.md)

## 7. Stopping and Resetting the Local Environment

For convenience, this repository includes helper scripts in the project root for stopping or resetting the local Docker-based backend services.

### 7.1 Stopping the Backend

To stop all running backend containers without removing them:

```sh
./stop.sh
```

### 7.2 Resetting the Backend

To stop and remove all backend containers:

```sh
./reset.sh
```

This will stop and remove all backend Docker containers, but **preserve database and storage data**, which remain stored on your local filesystem via Docker volumes.

### 7.3 Resetting Application Data

To fully remove all data (including database schema, database contents, and annotation storage), you must manually delete the contents of the following folders:

- `supabase/docker/volumes/db/data`
- `supabase/docker/volumes/storage`

> [!WARNING]
> Deleting these folders will permanently remove all local application data.
