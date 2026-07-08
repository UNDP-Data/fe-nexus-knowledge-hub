This is a React + TypeScript + Vite project powered by Tailwind CSS, and the UNDP Design System, bootstrapped with [@undp/create-app](https://www.npmjs.com/package/@undp/create-app). 

It includes:
* React 19.x with React compiler
* UNDP Design System
* Routing with [TanStack Router](https://tanstack.com/router)
* Data fetching with [TanStack Query](https://tanstack.com/query)
* TailwindCSS
* Code linting and formatting via Biome

## 🧩 Installation

This project uses `npm`. 

For installation you will need to install `node` and `npm`, if you don't already have it. `node` and `npm` can be installed from [here](https://nodejs.org/en/download/).

To install the project, simply run `npm install` in the project folder in the terminal on Mac or Command Prompt on Windows.

## 🚀 Local Development

To start the project locally:

```bash
npm run dev
```

This is run the app in development mode. Open [http://localhost:5173/](http://localhost:5173/) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

## 📜 Available Scripts

- `npm run dev`: Executes `vite` and start the local server for local deployment.
- `npm run build`: Executes `tsc && vite build` and builds the app for production and deployment.
- `npm run preview`: Executes `vite preview` and serves the static build output (from vite build) locally.
- `npm run clean`: Executes `rimraf node_modules && rimraf dist && rimraf package-lock.json` and remove node_modules folder, dist folder and package-lock.json.
- `npm run check`: Executes `biome check .` and lists all the linting and prettier errors.
- `npm run check:fix`: Executes `biome check --write .` and resolve all the linting and prettier errors.

## 🧰 Tooling Setup

This project uses Biome integrated to automatically format and lint your code.

If you’re using Visual Studio Code, install:
* [Biome extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)

Your editor should now show linting errors and automatically fix issues where possible.

More info: [Biome Docs](https://biomejs.dev/guides/getting-started/)

## 🎨 Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling and and includes pre-configured design tokens from the UNDP Design System.

## 🧭 Routing

Routing is powered by [TanStack Router](https://tanstack.com/router) and uses a code-based configuration (in the `./src/main.tsx`).

### Adding A Route

Example: add an `/about` route:

```tsx
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: () => <h1>About</h1>,
});
```

Then, register it in your `routeTree`:

```tsx
const routeTree = rootRoute.addChildren([indexRoute, aboutRoute]);
```

You can define your component in another file:

```tsx
import About from "./components/About.tsx";

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: About,
});
```

More info: [Code Based Routing](https://tanstack.com/router/latest/docs/framework/react/guide/code-based-routing).

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

Use the `Link` component for client-side navigation:

```tsx
import { Link } from "@tanstack/react-router";

<Link to="/about">About</Link>
```

More info: [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

## 🔍 Data Fetching

Data fetching is powered by [TanStack Query](https://tanstack.com/query) for efficient, declarative data fetching and caching.

## 📬 Contact us

For questions or feedback, contact us at [data@undp.org](mailto:data@undp.org).