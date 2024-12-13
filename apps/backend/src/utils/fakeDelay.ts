export const fakeContainerStart = (time: number) => {
	return new Promise<void>((resolve) => {
		setTimeout(() => {
			resolve();
		}, time);
	});
};
