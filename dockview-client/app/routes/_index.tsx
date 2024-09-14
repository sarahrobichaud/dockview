import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async () => {
  try {
    const res = await fetch("http://backend:3000/api/hello");
    const data = await res.json();

    return { data };
  } catch (err) {
    console.error(err);
    return { data: {} };
  }
};

export default function Index() {
  const { data } = useLoaderData<typeof loader>();

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="mx-auto w-full max-w-[500px] text-center">
        <h1 className="text-5xl my-6">Dockview Prototype</h1>
        <div className="my-4 bg-gray-500 rounded p-4">
          <h2 className="text-2xl">Fetch test</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
        <div className="my-4 bg-gray-500 rounded h-[500px]">
          <h2 className="text-2xl">Iframe Test</h2>
          <iframe
            src="http://localhost:3000/test"
            className="h-full w-full border-box"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
