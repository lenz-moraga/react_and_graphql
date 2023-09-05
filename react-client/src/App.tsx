import UserDisplay from "./components/UserDisplay";

import { useQuery } from "urql";
import { GetUsersDocument } from "./graphql/generated";

function App() {
  // Here we set the query using the useQuery function to get the data, and we don't need to specify the types of the result because the typing is already being specified in the GetUsersDocument object.
  const [results] = useQuery({
    query: GetUsersDocument,
  });

  return (
    <div className="flex gap-x-24 justify-24">
      <div className="bg-zinc-800 flex-col h-screen w-full flex items-center justify-center p-4 g-y-12 overflow-scroll">
        {results.data?.users.map((user, i) => (
          <UserDisplay user={user} key={i} />
        ))}
      </div>
    </div>
  );
}

export default App;
