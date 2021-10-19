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
        users: [{
          _id: "61488ff550242b75f88e41f8",
          firstName: "arka",
          lastName: "Parui",
          email: "ark@gmail.com",
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
describe("Mutations", () => {
  let tester;
  beforeAll(() => {
    tester = new EasyGraphQLTester(userSchema);
  });

  describe("Mutations", () => {
    test("Given_createUser_MutationShouldPass_IfTheFirstArgIsFalse_AndTheInputIsEmpty", () => {
      const mutation = `
        mutation createUser($input: UserInput!) {
          createUser(input: $input) {
            firstName
            lastName
            email
            password
          }
        }
      `;
      // First arg: false because the query is valid but the input value is empty
      // Second arg: query to test
      // Third argument is the input of the mutation
      tester.test(false, mutation, {});
    });
    test("Given_createUser_MutationShouldPass_IfTheFirstArg_IsFalse_And_TheInputHasInvalidField", () => {
      const mutation = `
      mutation createUser($input: UserInput!) {
        createUser(input: $input) {
          firstName
          lastName
          email
          password
        }
        }
      `;
      // First arg: false because the mutation is valid but the input value has invalid field
      // Second arg: mutation to test
      // Third argument is the input of the mutation
      tester.test(false, mutation, [
        {
          firstName: "Arka",
          lastName: "parui",
          email: "arka.spectacular@gmail.com",
        }
      ]);
    });
    test("Given_createUser_MutationShouldPass_IfTheFirstArgIsTrue_And_TheInputIsValid", () => {
      const mutation = `
        mutation createUser($input: UserInput) {
          createUser(input: $input) {
          firstName
          }
        }
      `;
      // First arg: true because the mutation is valid
      // Second arg: mutation to test
      // Third argument is the input of the mutation
      tester.test(true, mutation, {
        firstName: "Arka",
        lastName: "Parui",
        email: "arka.spectacular@gmail.com",
        password: "lkjoi@!#"
      });
    });
  })
})





