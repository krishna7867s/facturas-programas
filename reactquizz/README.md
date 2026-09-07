# React + Vite

## Proyección de ingresos

La proyección de ingresos se calcula como el promedio de los últimos 3 periodos de facturación registrados en el dashboard.

En la lógica del proyecto, primero se agrupan los ingresos por mes con `byPeriod`, luego se toman los últimos 3 elementos del arreglo y se promedian:

- `projection = byPeriod.slice(-3).reduce((sum, period) => sum + period.revenue, 0) / Math.min(byPeriod.length, 3)`

Esto permite estimar el ingreso mensual esperado a partir de la tendencia reciente, usando los periodos más actuales como referencia.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
