const CountryList = ({ countries, showCountry }) => {
  return (
    <ul>
      {countries.map((country) => (
        <li key={country.name.common}>
          {country.name.common}{" "}
          <button onClick={() => showCountry(country.name.common)}>show</button>
        </li>
      ))}
    </ul>
  );
};

export default CountryList;
