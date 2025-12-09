export function serializeData(obj: object) {
	return JSON.stringify(obj, (_key, val) =>
		typeof val === "bigint" ? val.toString() : val
	);
}
