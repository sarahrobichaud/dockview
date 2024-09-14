import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

type LoaderData = {
  message: string;
  PUBLIC_ADDRESS: string;
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { dockview } = context;
  console.log({ dockview });

  const data = {} as LoaderData;

  data.PUBLIC_ADDRESS = dockview.PUBLIC_ADDRESS;

  try {
    const res = await fetch(`${dockview.INTERNAL_ADDRESS}/api/hello`);

    const json = await res.json();

    data.message = json.message + " from Remix!";

    return data;
  } catch (err) {
    console.error(err);
    return data;
  }
};

export default function Index() {
  const { PUBLIC_ADDRESS, message } = useLoaderData<typeof loader>();

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="mx-auto w-full max-w-[500px] text-center">
        <h1 className="text-5xl my-6">Dockview Prototype</h1>
        <div className="my-4 bg-gray-500 rounded p-4">
          <h2 className="text-2xl">Fetch test</h2>
          <p>{message}</p>
        </div>
        <div className="my-4 bg-gray-500 rounded h-[500px]">
          <h2 className="text-2xl">Iframe Test</h2>
          <iframe
            src={`${PUBLIC_ADDRESS}/test`}
            className="h-full w-full border-box"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
