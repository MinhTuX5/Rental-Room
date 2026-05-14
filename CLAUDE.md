# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server
npm run build      # Production build
npm run preview    # Preview production build
```

No test or lint commands are configured.

## Architecture Overview

This is a **Vue 3 + Vite** SPA for a rental room platform with three user roles: **RoomSeeker** (browses/bookmarks rooms), **Innkeeper** (manages properties and tenants), and **Admin** (approves posts). The backend is an ASP.NET Core API at `localhost:44364/api/v1/`.

### Key Layers

**API Layer** (`src/apis/`): Feature-organized modules (userAPI, roomSearchAPI, roomManagementAPI, etc.) built on top of `crudAPI.js` and `httpClient.js`. The HTTP client handles JWT injection and 401 redirects via Axios interceptors. All API modules extend base classes in `baseAPI/`.

**State** (`src/stores/`): Pinia stores mirroring the API feature split. `appStore.js` holds global alert/snackbar state. `baseStore.js` and `baseDicStore.js` are base classes for feature and dictionary stores respectively.

**Routing** (`src/router/index.js`): Uses lazy-loaded dynamic imports for code splitting. Route guards check Firebase auth state and user roles before allowing navigation.

**Components**: Two-level split — `src/views/` for page-level containers, `src/components/` for reusable pieces. Components are further organized by feature (`roomSearch/`, `roomManagement/`, `admin/`, `auth/`). Base/atomic components live in `src/components/base/`.

### Authentication Flow

Firebase handles identity; the app exchanges a Firebase ID token for a backend JWT. The JWT is stored and attached to every API request via the Axios interceptor in `httpClient.js`. Role (Admin/Innkeeper/RoomSeeker) is encoded in the JWT and controls which routes/features are accessible.

### Tech Stack

- **Vue 3** with `<script setup>` Composition API
- **Vuetify 3** for UI components (configured in `src/plugins/vuetify.js`)
- **Pinia** for state management
- **Vue Router 4** with lazy-loaded routes
- **Firebase 11** for authentication
- **Vuelidate 2** for form validation
- **Cloudinary** for image uploads
- **FullCalendar 6** for scheduling views
- **SCSS** for styles (`src/styles/variables.scss` for shared variables)
