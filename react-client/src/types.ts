// We import the GetUSersQuery Type to has access to a more specific set of types that contain only the fields our query retrieves.

import type { GetUsersQuery } from "./graphql/generated";

export type Message = GetUsersQuery["users"][0]["messages"];

export type User = GetUsersQuery["users"][0];
