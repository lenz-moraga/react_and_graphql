# Build a GraphQL API.

We will start up a TypeScript project, provision a PostgreSQL database, initialize Prisma in your project, and finally seed your database.

## Create a TypeScript project

- Install the basic packages

  > `npm i -D ts-node-dev typescript @types/node`

  - ts-node-dev: Allows you to execute TypeScript code with live-reload on file changes
  - typescript: The TypeScript package that allows you to provide typings to your JavaScript applications
  - @types/node: TypeScript type definitions for Node.js

- Set up TypeScript
  > npx tsc --init
        - For this API we will leave the default settings.
- Add a development script
  > "dev": "ts-node-dev src/index.ts"
  - `npm run dev`

## Set up the database

- Head over to [https://railway.app](https://railway.app).
  - Hit the **New Project** button, or simply click the **Create a New Project** area.
  - You will be presented with a search box and a few common options. Select the **Provision PostgreSQL** option.
  - On the **Connect** tab, you will find your database's connection string.

## Set up Prisma

- To set up Prisma, you first need to install Prisma CLI as a development dependency:

  > npm i -D prisma

- Initialize Prisma, With Prisma CLI installed, you will have access to a set of useful tools and commands provided by Prisma. The command you will use here is called init, and will initialize Prisma in your project > npx prisma init

  ```
  generator client {
      provider = "prisma-client-js"
  }

  datasource db {
      provider = "postgresql"
      url = env("DATABASE_URL")
  }
  ```

- Set the environment variable using the database's connection string.

  > DATABASE_URL="your-connection-string"

## Model the database schema

  ```
  // prisma/schema.prisma

  model User {
      id Int @id @default(autoincrement())
      name String
      createdAt DateTime @default(now())
  }
  ```

- Perform the first migration, Our database schema is now modeled and we are ready to apply this schema to our database. We will use Prisma Migrate to manage our database migrations.

  > npx prisma migrate dev --name init

## Seed the database 

- create a new file named seed.ts and paste the following content:

  ```
    // prisma/seed.ts

    import { PrismaClient } from "@prisma/client";
    const prisma = new PrismaClient();

    async function main() {
        // Delete all `User` and `Message` records
        await prisma.message.deleteMany({});
        await prisma.user.deleteMany({});
        // (Re-)Create dummy `User` and `Message` records
        await prisma.user.create({
            data: {
                name: "Jack",
                // See the content of the prisma/seed.ts file in this repo...
    ```

- Now that the seed script is available, head over to our package.json file and add the following key to the JSON object:

  ```
  ...
  "prisma": {
      "seed": "ts-node-dev prisma/seed.ts"
  },
  ...
  ```

- Use the following command to run the seed script
  ```
  npx prisma db seed
  ``` 
  After running the script, if you head back to the Railway UI and into the Data tab, you should be able to navigate through the newly added data.

## Start up a GraphQL Server

### Set up a GraphQL server with GraphQL Yoga

The very first thing we will need to build a GraphQL API is a running GraphQL server. In this application, we will use [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server/docs) as our GraphQL server.

> npm install @graphql-yoga/node graphql

With those packages installed, we can now start up our own GraphQL server. Follow the instructions from the GraphQL documentation and then we will have access to a running (empty) GraphQL API:

> npm run dev

### Set up the Pothos schema builder

GraphQL uses a strongly typed schema to define how a user can interact with the API and what data should be returned. There are two different approaches to building a GraphQL schema: [code-first and SDL-first](https://www.prisma.io/blog/the-problems-of-schema-first-graphql-development-x1mn4cb0tyl3).

- Code-first: Your application code defines and generates a GraphQL schema
- SDL-first: You manually write the GraphQL schema

In this application, we will take the code-first approach using a popular schema builder named [Pothos](https://pothos-graphql.dev/).

- To get started with Pothos, we first need to install the core package:

    > npm i @pothos/core

    import the default export from the @pothos/core package and export an instance of it named builder:

    ```
    // src/builder.ts

    import SchemaBuilder from "@pothos/core";
    export const builder = new SchemaBuilder({});
    ```

### Defined your GraphQL object and query types
By default, GraphQL only supports a limited set of scalar data types:

- Int
- Float
- String
- Boolean
- ID

If we think back to our Prisma schema, however, we will remember there are a few fields defined that use the DateTime data type. To handle those within our GraphQL API, we will need to define a custom Date scalar type using [graphql-scalars](https://www.graphql-scalars.dev/)

> npm i graphql-scalars

We will need to register a Date scalar with our schema builder to let it know how to handle dates. The schema builder takes in a generic where we can specify various configurations.

Make the following changes to register the Data scalar type:

```
// src/builder.ts

import SchemaBuilder from "@pothos/core";
// 1
import { DateResolver } from "graphql-scalars";

// 2
export const builder = new SchemaBuilder<{
  Scalars: {
    Date: { Input: Date; Output: Date };
  };
}>({});

// 3
builder.addScalarType("Date", DateResolver, {});
```

Within our GraphQL object types and resolvers, can now use the `Date` scalar type.

- As soon as you add the generated types, you will notice a TypeScript error occur within the instantiation of the `SchemaBuilder`.

    Pothos is smart enough to know that, because you are using the Prisma plugin, you need to provide a prisma instance to the builder. Solve the errors and continue to the next section.

#### Create a reusable instance of Prisma Client

You now need to create a re-usable instance of Prisma Client that will be used to query your database and provide the types required by the builder from the previous step.

- Create a new file in the src folder named db.ts:
> src/db.ts

- Within that file, import Prisma Client and create an instance of the client named prisma. Export that instantiated client:

```
// src/db.ts

import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
```

- Import the prisma variable into src/builder.ts and provide it to builder to get rid of the final TypeScript error:

```
// src/builder.ts

// ...

import { prisma } from "./db";

export const builder = new SchemaBuilder<{
  Scalars: {
    Date: { Input: Date; Output: Date };
  };
  PrismaTypes: PrismaTypes;
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },
});

// ...
```

The Pothos Prisma plugin is now completely configured and ready to go. This takes the types generated by Prisma and allows you easy access to those within your GraphQL object types and queries.

#### **Add the Pothos Prisma plugin**
The next thing you need to do is define your GraphQL object types. These define the objects and fields your API will expose via queries.

Pothos has a fantastic [plugin](https://pothos-graphql.dev/docs/plugins/prisma) for Prisma that makes this process a lot smoother and provides type safety between your GraphQL types and the database schema.

- First, install the plugin:
    > npm i @pothos/plugin-prisma

    This plugin provides a Prisma generator that generates the types Pothos requires. Add the generator to your Prisma schema in `prisma/schema.prisma`:

    ```
    generator pothos {
        provider = "prisma-pothos-types"
    }
    ```

    Once that is added, you will need a way to generate Pothos' artifacts. So go ahead and create a new script in package.json to handle this:

    ```
    "scripts": {
         // ...
        "build": "npm i && npx prisma generate"
    }
    ```

    Now you can run that command to install your node modules and regenerate Prisma Client and the Pothos outputs:

    > npm run build

    When you run the command above, you should see that Prisma Client and the Pothos integration were both generated.

### Queried for data using Prisma Client

Currently, we have object types defined for our GraphQL schema, however we have not yet defined a way to actually access that data. To do this, we first need to initialize a [`Query` type](https://graphql.org/learn/schema/#the-query-and-mutation-types).

#### Implement the queries

At the bottom of our `src/builder.ts` file, intialize the `Query` type using `builder's queryType` function:

```
builder.queryType({});
```

This registers a special GraphQL type that holds the definitions for each of our queries and acts as the entry point to our GraphQL API.

Within this `queryType` function, we have the ability to add query definitions directly, however, we will define these separately within our codebase to better organize our code.

- Import the prisma instance into src/models/User.ts

    ```
    // src/models/User.ts

    import { builder } from "../builder";
    import { prisma } from "../db";

    // ...
    ```

- Then, using the builder's queryField function, define a "users" query that exposes the User object type we defined:

    ```
    // src/models/User.ts
    // ...

    // 1
    builder.queryField("users", (t) =>
    // 2
    t.prismaField({
        // 3
        type: ["User"],
        // 4
        resolve: async (query, root, args, ctx, info) => {
        return prisma.user.findMany({ ...query });
        },
    })
    );
    ```

    - The snippet above:

        - Adds a field to the GraphQL schema's `Query` type named `"users"`
        - Defines a field that resolves to some type in our Prisma schema
        - Lets Pothos know this field will resolve to an array of our Prisma Client's `User` type
        - Sets up a resolver function for this field.

#### Apply the GraphQL schema

We now have all of our GraphQL object types and queries defined and implemented.

Create a new file in src named schema.ts:

```
// src/schema.ts

import { builder } from "./builder";

import "./models/Message";
import "./models/User";

export const schema = builder.toSchema({});
```

Over in our `src/index.ts` file, import the `schema` variable We just created. The `createServer` function's configuration object takes a key named `schema` that will accept the generated GraphQL schema.

At this point, run the server so We can play with the API:

> npm run dev

After running the above command, open up http://localhost:4000/graphql in our browser to access the GraphQL playground.