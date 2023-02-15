const NameList = ({ name, number, deletePerson }) => (
  <tr>
    <td>{name}</td>
    <td>{number}</td>
    <td>
      <button onClick={deletePerson}>delete</button>
    </td>
  </tr>
);

const Book = ({ persons, filter, deletePerson }) => {
  return (
    <>
      <h2>Numbers</h2>
      <table>
        <tbody>
          {persons.filter((person) =>
            person.name.toLowerCase().includes(filter.toLowerCase())
          ).length === 0 ? (
            <tr>
              <td>"Nothing to show"</td>
            </tr>
          ) : (
            persons
              .filter((person) =>
                person.name.toLowerCase().includes(filter.toLowerCase())
              )
              .map(({ name, number, id }) => (
                <NameList
                  key={name}
                  name={name}
                  number={number}
                  deletePerson={() => deletePerson(id)}
                />
              ))
          )}
        </tbody>
      </table>
    </>
  );
};

export default Book;
