const EasyGraphQLTester = require('easygraphql-tester')
const fs = require('fs')
const path = require('path')

const resolvers = require('../app/graphql/resolvers/userResolvers')
const userSchema = fs.readFileSync(
    path.join(__dirname, ".", "schema.gql"),
    "utf8"
);

describe("Query", () => {
    let tester;
    beforeAll(() => {
        tester = new EasyGraphQLTester(userSchema);
    });

    test("Mocking Note Query", () => {
        const query = `
    query
    {
        notes
        {
          description
          title
        }
    }
    `;
        const fixture = {
            data: {
                notes: [
                    {
                        description: "Rocky Balboa was a difrnt vibe movie",
                        title: "Rock"
                    }
                ]
            }
        }
        tester.setFixture(fixture);
        const result = tester.mock({ query });
        expect(result.data.notes[0].description).toBe("Rocky Balboa was a difrnt vibe movie");
        expect(result.data.notes[0].title).toBe("Rock");
    });
});

