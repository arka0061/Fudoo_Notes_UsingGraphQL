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
describe("Mutations", () => {
  let tester;
  beforeAll(() => {
    tester = new EasyGraphQLTester(userSchema);
  });


  describe("Mutations", () => {

    //createNote Mutation Test Cases
    test("Given_createNote_MutationShouldPass_IfTheFirstArgIsFalse_AndTheInputIsEmpty", () => {
      const mutation = `
          mutation createNote($input: ) {
            createNote(input: $input) {
              title
              description
            }
          }
        `;
      // First arg: false because the query is valid but the input value is empty
      // Second arg: query to test
      // Third argument is the input of the mutation
      tester.test(false, mutation, {});
    });
  })
  test("Given_createNote_MutationShouldPass_IfTheFirstArg_IsFalse_And_TheInputHasInvalidField", () => {
    const mutation = `
        mutation createNote($input: InvalidInput) {
            createNote(input: $input) {
              title
              description
            }
          }
        `;
    // First arg: false because the mutation is valid but the input value has invalid field
    // Second arg: mutation to test
    // Third argument is the input of the mutation
    tester.test(false, mutation, [
      {
        title: "Rock",
        description: "Rocky Balboa was a difrnt vibe movie"
      }
    ]);
  });
  test("Given_createNote_MutationShouldPass_IfTheFirstArgIsTrue_And_TheInputIsValid", () => {
    const mutation = `
        mutation createNote($input: NoteInput) {
            createNote(input: $input) {
              title
              description
            }
          }
        `;
    // First arg: true because the mutation is valid
    // Second arg: mutation to test
    // Third argument is the input of the mutation
    tester.test(true, mutation, {
      title: "Rock",
      description: "Rocky Balboa was a difrnt vibe movie"
    });
  });

  //editNote Mutation Test Cases
  test("Given_createNote_MutationShouldPass_IfTheFirstArgIsFalse_AndTheInputIsEmpty", () => {
    const mutation = `
      mutation editNote($input: ) {
        editNote(input: $input) {
          noteId
          title
          description
        }
      }
    `;
    // First arg: false because the query is valid but the input value is empty
    // Second arg: query to test
    // Third argument is the input of the mutation
    tester.test(false, mutation, {});
  });
  test("Given_editNote_MutationShouldPass_IfTheFirstArg_IsFalse_And_TheInputHasInvalidField", () => {
    const mutation = `
        mutation editNote($input:InvalidInput ) {
            editNote(input: $input) {
              noteId
              title
              description
            }
          }
        `;
    // First arg: false because the mutation is valid but the input value has invalid field
    // Second arg: mutation to test
    // Third argument is the input of the mutation
    tester.test(false, mutation, [
      {
        title: "Rock",
        description: "Rocky Balboa was a difrnt vibe movie"
      }
    ]);
  });
  test("Given_editNote_MutationShouldPass_IfTheFirstArgIsTrue_And_TheInputIsValid", () => {
    const mutation = `
        mutation editNote($input:NoteEdit ) {
            editNote(input: $input) {
              title
              description
            }
          }
        `;
    // First arg: true because the mutation is valid
    // Second arg: mutation to test
    // Third argument is the input of the mutation
    tester.test(true, mutation, {
      title: "Rock",
      description: "Rocky Balboa was a difrnt vibe movie"
    });
  });

  //deletenote Mutation Test Case
  test("Given_deleteNote_MutationShouldPass_IfTheFirstArgIsFalse_AndTheInputIsEmpty", () => {
    const mutation = `
      mutation deleteNote($input: ) {
        deleteNote(input: $input) {
          title
          description
        }
      }
    `;
    // First arg: false because the query is valid but the input value is empty
    // Second arg: query to test
    // Third argument is the input of the mutation
    tester.test(false, mutation, {});
  });
  test("Given_deleteNote_MutationShouldPass_IfTheFirstArg_IsFalse_And_TheInputHasInvalidField", () => {
    const mutation = `
        mutation deleteNote($input:InvalidInput ) {
            deleteNote(input: $input) {
              title
              description
            }
          }
        `;
    // First arg: false because the mutation is valid but the input value has invalid field
    // Second arg: mutation to test
    // Third argument is the input of the mutation
    tester.test(false, mutation, [
      {
        title: "Rock",
        description: "Rocky Balboa was a difrnt vibe movie"
      }
    ]);
  });
  test("Given_deleteNote_MutationShouldPass_IfTheFirstArgIsTrue_And_TheInputIsValid", () => {
    const mutation = `
        mutation deleteNote($input:DeleteNote ) {
            deleteNote(input: $input) {
              title
              description
            }
          }
        `;
    // First arg: true because the mutation is valid
    // Second arg: mutation to test
    // Third argument is the input of the mutation
    tester.test(true, mutation, {
      title: "Rock",
      description: "Rocky Balboa was a difrnt vibe movie"
    });
  });

  //getNotes Mutation Test Cases
  test("Given_getNotes_MutationShouldPass_IfTheFirstArgIsTrue_And_TheInputIsValid", () => {
    const mutation = `
        mutation getNotes {
            getNotes {
              title
              description
            }
          }
        `;
    // First arg: true because the mutation is valid
    // Second arg: mutation to test
    // Third argument is the input of the mutation
    tester.test(true, mutation, {
      title: "Rock",
      description: "Rocky Balboa was a difrnt vibe movie"
    });
  });

  //restore Notes Mutation Test Cases
  test("Given_restoreNote_MutationShouldPass_IfTheFirstArgIsFalse_AndTheInputIsEmpty", () => {
    const mutation = `
    mutation restoreNote($input: ) {
      restoreNote(input: $input)    
    }
  `;
    // First arg: false because the query is valid but the input value is empty
    // Second arg: query to test
    // Third argument is the input of the mutation
    tester.test(false, mutation, {});
  });
  test("Given_restoreNote_MutationShouldPass_IfTheFirstArg_IsFalse_And_TheInputHasInvalidField", () => {
    const mutation = `
    mutation restoreNote($input:InvalidInput ) {
      restoreNote(input: $input)    
    }
    `;
    // First arg: false because the mutation is valid but the input value has invalid field
    // Second arg: mutation to test
    // Third argument is the input of the mutation
    tester.test(false, mutation, [
      {
        restoreNote: `Note with id:6171829e0db084127969c575 is restored Sucessfully`
      }
    ]);
  });
  test("Given_restoreNote_MutationShouldPass_IfTheFirstArgIsTrue_And_TheInputIsValid", () => {
    const mutation = `
  mutation restoreNote($input:RestoreNote ) {
    restoreNote(input: $input)    
  }
  `;
    // First arg: true because the mutation is valid
    // Second arg: mutation to test
    // Third argument is the input of the mutation
    tester.test(true, mutation, {
      restoreNote: `Note with id:6171829e0db084127969c575 is restored Sucessfully`
    });
  });

  //deleteNoteForever Mutation Testing
  test("Given_deleteNoteForever_MutationShouldPass_IfTheFirstArgIsFalse_AndTheInputIsEmpty", () => {
    const mutation = `
    mutation restoreNote($input: ) {
      deleteNoteForever(input: $input)    
    }
  `;
    // First arg: false because the query is valid but the input value is empty
    // Second arg: query to test
    // Third argument is the input of the mutation
    tester.test(false, mutation, {});
  });
  test("Given_deleteNoteForever_MutationShouldPass_IfTheFirstArg_IsFalse_And_TheInputHasInvalidField", () => {
    const mutation = `
    mutation deleteNoteForever($input:InvalidInput ) {
      deleteNoteForever(input: $input)    
    }
    `;
    // First arg: false because the mutation is valid but the input value has invalid field
    // Second arg: mutation to test
    // Third argument is the input of the mutation
    tester.test(false, mutation, [
      {
        deleteNoteForever: `Note with Noteid:6171829e0db084127969c575 is deleted permanently`
      }
    ]);
  });
  test("Given_deleteNoteForever_MutationShouldPass_IfTheFirstArgIsTrue_And_TheInputIsValid", () => {
    const mutation = `
  mutation deleteNoteForever($input:DeleteNote ) {
    deleteNoteForever(input: $input)    
  }
  `;
    // First arg: true because the mutation is valid
    // Second arg: mutation to test
    // Third argument is the input of the mutation
    tester.test(true, mutation, {
      deleteNoteForever: `Note with Noteid:6171829e0db084127969c575 is deleted permanently`
    });
  });

  //display trash Mutation Test Case
  test("Given_displayTrash_MutationShouldPass_IfTheFirstArgIsTrue_And_TheInputIsValid", () => {
    const mutation = `
    mutation displayTrash {
      displayTrash {
        title
        description
      }
    }
     `;
    // First arg: true because the mutation is valid
    // Second arg: mutation to test
    // Third argument is the input of the mutation
    tester.test(true, mutation, {
      displayTrash: [
        {
          title: "Test 1",
          description: "Testing 1"
        }
      ]
    });
  });
})




