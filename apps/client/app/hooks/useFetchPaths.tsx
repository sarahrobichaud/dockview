import { useEffect, useRef, useState } from "react";

// Assuming the type of data fetched is an array of strings, you can adjust this type as needed

export const useFetchModulePaths = (
  module: string
): [data: string[], loading: boolean] => {
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const promiseRef = useRef<Promise<string[]>>();

  useEffect(() => {
    const fetchData = async () => {
      const url = `/vault/${module}`;
      promiseRef.current = fetch(url).then((res) => res.json());
      try {
        const paths = await promiseRef.current;
        setData(paths);
        setLoading(false);
      } catch (error) {
        throw promiseRef.current; // Throw the promise so Suspense can catch it
        // Handle errors as appropriate
      }
    };
    fetchData();
  }, []);

  return [data, loading];
};
