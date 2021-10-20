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
describe("Mutations", () => {
    let tester;
    beforeAll(() => {
        tester = new EasyGraphQLTester(userSchema);
    });


    describe("Mutations", () => {
        //createLabel Mutation Test Cases

        test("Given_createLabel_MutationShouldPass_IfTheFirstArgIsFalse_AndTheInputIsEmpty", () => {
            const mutation = `
        mutation createLabel($input: LabelInput) {
          createLabel(input: ) 
        }
      `;
            // First arg: false because the query is valid but the input value is empty
            // Second arg: query to test
            // Third argument is the input of the mutation
            tester.test(false, mutation, {});
        });
    })
    test("Given_createLabel_MutationShouldPass_IfTheFirstArg_IsFalse_And_TheInputHasInvalidField", () => {
        const mutation = `
        mutation createLabel($input: InvalidInput!) {
            createLabel(input: $input) 
          }
        `;
        // First arg: false because the mutation is valid but the input value has invalid field
        // Second arg: mutation to test
        // Third argument is the input of the mutation
        tester.test(false, mutation, [
            {
                String
            }
        ]);
    });
    test("Given_createLabel_MutationShouldPass_IfTheFirstArgIsTrue_And_TheInputIsValid", () => {
        const mutation = `
        mutation createLabel($input: LabelInput) {
            createLabel(input: $input) 
          }
        `;
        // First arg: true because the mutation is valid
        // Second arg: mutation to test
        // Third argument is the input of the mutation
        tester.test(true, mutation, {
            createLabel: "New Label Created Sucessfully"
        });
    });

    //editLabel Mutation Test Cases
    test("Given_editLabel_MutationShouldPass_IfTheFirstArgIsFalse_AndTheInputIsEmpty", () => {
        const mutation = `
    mutation editLabel($input: EditLabel) {
      editLabel(input: ) 
    }
  `;
        // First arg: false because the query is valid but the input value is empty
        // Second arg: query to test
        // Third argument is the input of the mutation
        tester.test(false, mutation, {});
    });
    test("Given_editLabel_MutationShouldPass_IfTheFirstArg_IsFalse_And_TheInputHasInvalidField", () => {
        const mutation = `
        mutation editLabel($input: InvalidInput) {
            editLabel(input: $input) 
          }
        `;
        // First arg: false because the mutation is valid but the input value has invalid field
        // Second arg: mutation to test
        // Third argument is the input of the mutation
        tester.test(false, mutation, [
            {
                String
            }
        ]);
    });
    test("Given_editLabel_MutationShouldPass_IfTheFirstArgIsTrue_And_TheInputIsValid", () => {
        const mutation = `
        mutation editLabel($input: EditLabel) {
            editLabel(input: $input) 
          }
        `;
        // First arg: true because the mutation is valid
        // Second arg: mutation to test
        // Third argument is the input of the mutation
        tester.test(true, mutation, {
            editLabel: "Note Removed From Label Sucessfully"
        });
    });

    //deleteLabel Mutation Test Cases
    test("Given_deleteLabel_MutationShouldPass_IfTheFirstArgIsFalse_AndTheInputIsEmpty", () => {
        const mutation = `
    mutation deleteLabel($input: DeleteLabelInput) {
      deleteLabel(input: ) 
    }
  `;
        // First arg: false because the query is valid but the input value is empty
        // Second arg: query to test
        // Third argument is the input of the mutation
        tester.test(false, mutation, {});
    });
    test("Given_deleteLabel_MutationShouldPass_IfTheFirstArg_IsFalse_And_TheInputHasInvalidField", () => {
        const mutation = `
        mutation deleteLabel($input: InvalidInput) {
            deleteLabel(input: $input) 
          }
        `;
        // First arg: false because the mutation is valid but the input value has invalid field
        // Second arg: mutation to test
        // Third argument is the input of the mutation
        tester.test(false, mutation, [
            {
                String
            }
        ]);
    });
    test("Given_deleteLabel_MutationShouldPass_IfTheFirstArgIsTrue_And_TheInputIsValid", () => {
        const mutation = `
        mutation deleteLabel($input: DeleteLabelInput) {
            deleteLabel(input: $input) 
          }
        `;
        // First arg: true because the mutation is valid
        // Second arg: mutation to test
        // Third argument is the input of the mutation
        tester.test(true, mutation, {
            deleteLabel: "Deleted Sucessfully"
        });
    });

    //searchLabel Mutation Test Cases
    test("Given_searchLabel_MutationShouldPass_IfTheFirstArgIsFalse_AndTheInputIsEmpty", () => {
        const mutation = `
    mutation searchLabel($input: SearchLabel) {
      searchLabel(input: ) 
    }
  `;
        // First arg: false because the query is valid but the input value is empty
        // Second arg: query to test
        // Third argument is the input of the mutation
        tester.test(false, mutation, {});
    });
    test("Given_searchLabel_MutationShouldPass_IfTheFirstArg_IsFalse_And_TheInputHasInvalidField", () => {
        const mutation = `
        mutation searchLabel($input: InvalidInput) {
            searchLabel(input:$input ) 
            {
                labels
                {
                  labelName
                  noteId
                }
                getLabelContent
                {
                  title
                  description
                }
            }
          }
        `;
        // First arg: false because the mutation is valid but the input value has invalid field
        // Second arg: mutation to test
        // Third argument is the input of the mutation
        tester.test(false, mutation, [
            {
                labels: [
                    {
                        labelName: "Label One",
                        noteId: [
                            "6163d98f2137afa6e34d6c95",
                            "6163d9b72137afa6e34d6c9e"
                        ]
                    }
                ],
                getLabelContent: [
                    {
                        title: "Rock",
                        description: "Rocky Balboa was a difrnt vibe movie"
                    },
                ]

            }
        ]);
    });
    test("Given_searchLabel_MutationShouldPass_IfTheFirstArgIsTrue_And_TheInputIsValid", () => {
        const mutation = `
        mutation searchLabel($input: SearchLabel) {
            searchLabel(input:$input ) 
            {
                labels
                {
                  labelName
                  noteId
                }
                getLabelContent
                {
                  title
                  description
                }
            }
          }
        `;
        // First arg: true because the mutation is valid
        // Second arg: mutation to test
        // Third argument is the input of the mutation
        tester.test(true, mutation, [
            {
                labels: [
                    {
                        labelName: "Label One",
                        noteId: [
                            "6163d98f2137afa6e34d6c95",
                            "6163d9b72137afa6e34d6c9e"
                        ]
                    }
                ],
                getLabelContent: [
                    {
                        title: "Rock",
                        description: "Rocky Balboa was a difrnt vibe movie"
                    },
                ]
            }
        ]);
    })
})