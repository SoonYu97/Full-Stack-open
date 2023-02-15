const Country = ({ country }) => {
  return (
    <>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <ul>
        {Object.entries(country.languages).map(([key, language]) => (
          <li key={key}>{language}</li>
        ))}
      </ul>
      <img alt={country.flags.alt} src={country.flags.png} />
    </>
  );
};

export default Country;
