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

    test("Mocking Label Query", () => {
        const query = `
    query
    {
        getLabel
        {
          labelName
          noteId
        }
    }
    `;
        const fixture = {
            data: {
                getLabel: [
                    {
                      labelName: "Label One",
                      noteId: [
                        "6163d98f2137afa6e34d6c95"
                      ]
                    }]
                }
        }
        tester.setFixture(fixture);
        const result = tester.mock({ query });
        expect(result.data.getLabel[0].labelName).toBe("Label One");
        expect(result.data.getLabel[0].noteId[0]).toBe("6163d98f2137afa6e34d6c95",
        "6163d9b72137afa6e34d6c9e");
    });
});

