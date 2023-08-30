import UserDisplay from "./components/UserDisplay";
import { User } from "./types";

function App() {
  const users: User[] = [
    {
      name: "Prisma Fan",
      messages: [
        { body: "Prisma rocks!" },
        { body: "Did I mention I Love Prisma?" },
      ],
    },
  ];

  return (
    <div className="flex gap-x-24 justify-24">
      <div className="bg-zinc-800 flex-col h-screen w-full flex items-center justify-center p-4 g-y-12 overflow-scroll">
        {users.map((user, i) => (
          <UserDisplay user={user} key={i} />
        ))}
      </div>
    </div>
  );
}

export default App;
