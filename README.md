# vue-crm-frontend

Frontend built with Vite, Vue 3, Tailwind CSS and TypeScript.

## Demo

https://vue-crm-frontend.netlify.app

### Features

The project is built with a focus on performance, scalability, and maintainability:

- Role Based Access Control: Admin, Manager, Engineer.
- Permissions: Each role has associated permissions.
- CRM: Customers, Projects, Tasks and Leads.

## Installation

1. Clone the repository and then install required dependencies

```
git clone git@github.com:Bascil/vue-crm-frontend.git
```

2. Navigate to the target directory

```
cd vue-crm-frontend
```

3. Install dependencies

```bash
$ npm install
```

4. Configure environment variables

```
cp .env.example .env
```

```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## Running the app

```bash
# development
$ npm run dev

