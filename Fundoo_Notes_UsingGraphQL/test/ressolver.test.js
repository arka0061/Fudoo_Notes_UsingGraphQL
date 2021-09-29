const EasyGraphQLTester = require('easygraphql-tester')
const fs = require('fs')
const { expect } = require("chai");
const path = require('path')

const resolvers = require('../app/graphql/resolvers/userResolvers')
const userSchema = fs.readFileSync(
  path.join(__dirname, ".", "schema.gql"),
  "utf8"
);

describe("Test my schema, Mutations", () => {
    let tester;
    beforeAll(() => {
      tester = new EasyGraphQLTester(userSchema);
    });
  
    describe("Mutations", () => {
      test("Should pass if the first arg is false, and the input is empty", () => {
        const mutation = `
          mutation createUser($input: UserInput!) {
            createUser(input: $input) {
              email
            }
          }
        `;
        // First arg: false because the mutation is valid but the input value is empty
        // Second arg: mutation to test
        // Third argument is the input of the mutation
        tester.test(false, mutation, {});
      })
      test("Should pass if the first arg is false, and the input arr is empty", () => {
        const mutation = `
          mutation CreateUsers($input: [UserInput]!) {
            createUsers(input: $input) {
              email
            }
          }
        `;
        // First arg: false because the query is valid but the input value is empty
        // Second arg: query to test
        // Third argument is the input of the mutation
        tester.test(false, mutation, []);
      });
  
      test("Should pass if the first arg is false, and the input has invalid field", () => {
        const mutation = `
          mutation CreateUsers($input: [UserInput]!) {
            createUsers(input: $input) {
              email
            }
          }
        `;
        // First arg: false because the mutation is valid but the input value has invalid field
        // Second arg: mutation to test
        // Third argument is the input of the mutation
        tester.test(false, mutation, [
          {
            email: "demo@demo.com",
            firstName: "demo",
            lastName: "Demo name"
          }
        ]);
      });
  
      
      });
    });

  
    