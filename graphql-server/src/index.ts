import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";
// Setting graphql-yoga as our GraphQL Server

import { schema } from "./schemas";

const port = Number(process.env.API_PORT) || 4000;

const yoga = createYoga({
  schema,
});

const server = createServer(yoga);

server.listen(port, () => {
  console.log(`GraphQL Server ready at http://localhost:${port}/graphql !`);
});
