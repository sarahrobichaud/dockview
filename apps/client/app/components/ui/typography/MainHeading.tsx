export default function MainHeading({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <h1
      className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ${className}`}
    >
      {children}
    </h1>
  );
}
