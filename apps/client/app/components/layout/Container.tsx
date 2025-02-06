import React from "react";

export default function Container({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mx-auto w-full max-w-[1500px] px-4 md:px-8 lg:px-16 ${className}`}>
      {children}
    </div>
  );
}
