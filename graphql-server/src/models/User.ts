import { builder } from "../builder";
import { prisma } from "../db";

// it may seem redundant to manually defin GraphQLobject types when you've already defined the sahpe of the data in the Prisma schema. But the Prisma schema defines the sape of the data in the DB, while the GraphQL schema efines the data available in the API
builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    messages: t.relation("messages"),
  }),
});
// Thanks to the Prisma Plugin, we have the method prismaObject which we will be using to define our object types auto-completion with a list of available models from our Prisma schema

builder.queryField("users", (t) =>
  t.prismaField({
    type: ["User"],
    resolve: async (query, root, args, ctx, info) => {
      return prisma.user.findMany({ ...query });
    },
  })
);

// The code above adds a fild to the GraphQL schema's named users, defines a field that resovles to some type in our Prisma schema, lets pothos know this field will resolve to an array of our Prisma client's user type and finally sets a resolver function for that field
