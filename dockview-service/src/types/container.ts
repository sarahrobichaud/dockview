type StaticContainer = {
	type: "static";
	path: string;
};

type ServerContainer = {
	type: "server";
	port: number;
	ip: string;
};

type DemoContainer = {
	type: "demo";
	path: string;
};

//

export type Container = {
	ready: boolean;
	lastAccessed: number;
	statusMessage: string;
} & (StaticContainer | ServerContainer | DemoContainer);
