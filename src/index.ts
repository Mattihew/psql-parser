import { Readable, ReadableOptions } from "stream";
import { createInterface } from "readline";
import { createReadStream } from "fs";

interface QuerySet {
	connection: string;
	query: string;
}

export const parseStream = async (input: Readable): Promise<QuerySet[]> => {
	const result: QuerySet[] = [];
	const reader = createInterface(input);

	let currentQuery: QuerySet = { connection: "", query: "" };
	result.push(currentQuery);

	reader.on("line", (line) => {
		if (line.trimStart().startsWith("\\connect ") || line.trimStart().startsWith("\\c ")) {
			currentQuery = {
				connection: line.replace("\\connect", "").replace("\\c", "").trim(),
				query: "",
			};
			result.push(currentQuery);
		} else {
			currentQuery.query += line;
		}
	});

	return new Promise((resolve, reject) => {
		reader.on("close", () => {
			resolve(result.filter((qs) => Boolean(qs.query)));
		});
	});
};

export const parseString = (input: string, options?: ReadableOptions) => parseStream(Readable.from([input], options));

export const parseFile = (file: string, options?: Parameters<typeof createReadStream>[1]) => parseStream(createReadStream(file, options))