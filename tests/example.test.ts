import { readFileSync, createReadStream } from "fs";
import { parseStream, parseString, parseFile } from "../src/index";

const expectedResult = [
	{
		connection: "database_1",
		query: "SELECT * from the_table;DELETE from the_table;",
	},
	{ connection: "database_2", query: "SELECT * from other_table;" },
	{ connection: "database_1", query: "SELECT * from the_table;" }
];

describe("test file", () => {
	test("parse stream", async () => {
		const querySteam = createReadStream("./tests/testData.psql", "utf-8");
		const result = await parseStream(querySteam);
		expect(result).toEqual(expectedResult);
	});

	test("parse string", async () => {
		const queryString = readFileSync("./tests/testData.psql", "utf-8");
		const result = await parseString(queryString);
		expect(result).toEqual(expectedResult);
	});

	test("parse file", async () => {
		const result = await parseFile("./tests/testData.psql");
		expect(result).toEqual(expectedResult);
	});
});
