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

  test("Mocking User Query", () => {
    const query = `
    query
    {
      users {
        _id
        firstName
        lastName
        email
        password
      }
    }
    `;

    const fixture = {
        data: {
        users:[ {
          _id: "61488ff550242b75f88e41f8",
          firstName: "arka",
          lastName: "Parui",
          email:"ark@gmail.com",
          password: "dawsddsd"
        }]
      }
    }
    tester.setFixture(fixture);
    const result = tester.mock({ query });
    expect(result.data.users[0]._id).toBe("61488ff550242b75f88e41f8",);
    expect(result.data.users[0].firstName).toBe("arka");
    expect(result.data.users[0].lastName).toBe("Parui");
    expect(result.data.users[0].email).toBe("ark@gmail.com");
    expect(result.data.users[0].password).toBe("dawsddsd");
  
  });
});

