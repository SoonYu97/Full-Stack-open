import { useState, useEffect } from "react";

import countryServices from "./services/countries";
import Country from "./components/Country";
import CountryList from "./components/CountryList";

const App = () => {
  const [filter, setFilter] = useState("");
  const [allCountries, setAllCountries] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    countryServices.getAll().then((countries) => {
      setAllCountries(countries);
    });
  }, []);

  useEffect(() => {
    if (filter.length > 0) {
      setCountries(
        allCountries
          .filter((country) =>
            country.name.common.toLowerCase().includes(filter.toLowerCase())
          )
          .sort((a, b) => {
            const nameA = a.name.common.toUpperCase();
            const nameB = b.name.common.toUpperCase();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }

            return 0;
          })
      );
    }
  }, [filter, allCountries]);

  const handleFilterChange = (e) => setFilter(e.target.value);

  const showCountry = (name) => {
    setFilter(name);
  };

  return (
    <div>
      <div>
        find countries <input value={filter} onChange={handleFilterChange} />
      </div>
      <div>
        {countries.length > 10 ? (
          "Too many matches, specify another filter"
        ) : countries.length > 1 ? (
          <CountryList countries={countries} showCountry={showCountry} />
        ) : countries.length > 0 ? (
          <Country country={countries[0]} />
        ) : (
          "No match, specify another filter"
        )}
      </div> 
    </div>
  );
};

export default App;
