# liiive Development Deployment

This guide walks you through the steps necessary to set up liiive in a **local development configuration**, intended for frontend development.

In development mode, the backend components (Supabase and the liiive WebSocket server) run as Docker containers and are exposed on localhost via different ports. The frontend application is started manually using the Astro/Vite development server, with hot module reloading enabled.

## 1. Prerequisites

Before you begin, make sure you have the following installed:

- Docker 24.0+ and Docker Compose 2.x
- Node.js 20+ and npm

## 2. Configuration

### 2.1 Supabase Configuration

1. Change into the `supabase/docker` folder:

   ```sh
   cd supabase/docker
   ```

2. Create a local environment file:

   ```sh
   cp .env.example .env
   ```

3. Configure Supabase by editing `.env`:
   - Follow the [official Supabase self-hosting guide](https://supabase.com/docs/guides/self-hosting/docker#configuring-and-securing-supabase).
   - For a quick local test setup, you can run:

     ```sh
     ./utils/generate-keys.sh
     ``` 

     This script will auto-generate all necessary passwords and secrets and write them to `.env`.

4. Pull the required Supabase Docker images:

   ```sh 
   docker compose pull
   ```

### 2.2 liiive Server Configuration

1. Change into the `liiive-server` directory:
   
   ```sh
   cd ../../liiive-server
   ```

2. Create a local environment file:

   ```sh
   cp .env.example .env
   ```

3. Update the following values in `.env`:
   - Ensure `SUPABASE_URL` is set to `http://kong:8000`
   - Set `SUPABASE_SERVICE_ROLE_KEY` to the value of `SERVICE_ROLE_KEY` from your Supabase `.env` file created in step 2.1.

## 3. Start Backend Services

1. Change back to the project root directory:

   ```sh
   cd ..
   ```

2. Start the development backend:

   ```sh
   ./start-dev.sh
   ```

Once the services are running, verify that everything started correctly:

- **WebSocket Server**
  Open <http://localhost:1234> in your browser. You should see the message:

  ```
  Welcome to Hocuspocus!
  ```

- **Supabase**
  Open <http://localhost:3000> in your browser. You should see Supabase Studio UI, with your project open as "Default Project".

If both services respond as expected, the backend is running correctly.

> [!NOTE]
> Note that Supabase Studio is only protected by HTTP Basic login in production mode. In development mode, it is fully open.

## 4. Database Initialization

With the backend services running, initialize the liiive database schema.

1. Change into the initialization directory:

   ```sh 
   cd supabase/init
   ```

2. Run the database initialization script:

   ```sh
   ./init-db.sh
   ```

3. Verify in Supabase Studio that the database schema and annotation storage bucket have been created successfully. (You may need to reload the page.)

## 5. Configure and Start the Frontend App

With the backend running and the database initialized:

1. Change into the frontend directory:

   ```sh
   cd ../../liiive-client
   ```

2. Create a local environment file:

   ```sh
   cp .env.example .env
   ```

3. Update the following variables in `.env`:
  - `PUBLIC_SUPABASE_URL=http://localhost:8000`
  - `PUBLIC_SUPABASE_API_KEY`
    Set this to the Supabase anonymous key (`ANON_KEY`) from your Supabase `.env` file.
  - `SUPABASE_SECRET_SERVICE_API_KEY` 
    Set this to the Supabase service role key (`SERVICE_ROLE_KEY`).
  - `PUBLIC_HOCUSPOCUS_URL=ws://localhost:1234`

4. Install dependencies:

   ```sh
   npm install
   ```

5. Start the development server:

   ```sh
   npm start
   ```

6. Open your browser and navigate to:
   <http://localhost:4321>

You should now see the liiive frontend running in development mode, connected to your local backend.

## 6. Social Login

liiive supports social login via GitHub and Google. Configuration involves minor changes in the Supabase backend configuration, as well as setup steps in your GitHub and Google accounts. 

Full social login configuration information is available here: [social login configuration](guides/social-login.md)

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

> [!CAUTION]
> Deleting these folders will permanently erase all local application data!

## 8. Final Notes

- This setup is intended for **local development only.**
- All data is stored in your local Supabase Postgres instance.
- Annotations are stored as file assets in your local Supabase storage.