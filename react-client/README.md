# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

### Packages used and why

Here's a brief overview of why each of these packages are needed:

- [TailwindCSS](https://tailwindcss.com/) for styling the application, (including and postcss autoprefixer).
- [graphql](https://www.npmjs.com/package/graphql): The library that allows you to use GraphQL.
- [@graphql-codegen/cli](https://www.graphql-code-generator.com/docs/getting-started/installation): The CLI tool that allows you to use different plugins to generate assets from a GraphQL API.
- [@graphql-codegen/typescript](https://www.graphql-code-generator.com/plugins/typescript/typescript): The base plugin for GraphQL Codegen TypeScript-based plugins. This plugin takes your GraphQL API's schema and generates TypeScript types for each GraphQL type.
- [@graphql-codegen/typescript-operations](https://www.graphql-code-generator.com/plugins/typescript/typescript-operations): The GraphQL Codegen plugin that generates TypeScript types representing queries and responses based on queries you've written.
- [@graphql-codegen/typed-document-node](https://www.graphql-code-generator.com/plugins/typescript/typed-document-node): The GraphQL Codegen plugin that generates an Abstract Syntax Tree (AST) representation of any queries you've written.
- [@urql](https://formidable.com/open-source/urql/docs/): A GraphQL client library that allows you to easily query a GraphQL API and integrates with React.
