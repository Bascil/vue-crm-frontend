# Bingwa CRM

Dashboard starter template built with Vite, Vue 3, Tailwind CSS and TypeScript.

## Demo

https://vue-crm-frontend.netlify.app/


1. Install `@tailwindcss/ui`:

```sh
pnpm add @tailwindcss/ui
```

2. Add the plugin in `tailwind.config.js` without changing anything else:

```js
// tailwind.config.js
module.exports = {
  // ...
  // rest of the config
  plugins: [require('@tailwindcss/ui')],
}
```

## Project setup

```
pnpm install
```

### Compiles and hot-reloads for development

```
pnpm dev
```

### Compiles and minifies for production

```
pnpm build
```
