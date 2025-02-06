export default function Container({
	children,
	className,
}: React.HTMLAttributes<HTMLParagraphElement>) {
	return (
		<div className={`max-w-[1300px] w-full mx-auto ${className}`}>
			{children}
		</div>
	);
}
