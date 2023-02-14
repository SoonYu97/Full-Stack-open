const NameList = ({ name, number }) => (
  <tr>
    <td>{name}</td>
    <td>{number}</td>
  </tr>
);

const Book = ({ persons, filter }) => {
  return (
    <>
      <h2>Numbers</h2>
      <table>
        {persons.filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase())
        ).length === 0
          ? "Nothing to show"
          : persons
              .filter((person) =>
                person.name.toLowerCase().includes(filter.toLowerCase())
              )
              .map(({ name, number }) => (
                <NameList key={name} name={name} number={number} />
              ))}
      </table>
    </>
  );
};

export default Book;
