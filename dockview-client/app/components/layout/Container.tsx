import React from "react";

export default function Container({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mx-auto w-full max-w-[800px] ${className}`}>
      {children}
    </div>
  );
}
