export class DockviewEvent<T> extends Event {
	constructor(type: string, eventInitDict?: CustomEventInit<T>) {
		super(type, eventInitDict);
		this.detail = eventInitDict?.detail ?? ({} as T);
	}

	readonly detail: T;
}
