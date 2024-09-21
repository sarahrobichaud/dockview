import { PropsWithChildren } from "react";

export default function SecondaryHeading({ children }: PropsWithChildren) {
  return (
    <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
      {children}
    </h1>
  );
}
