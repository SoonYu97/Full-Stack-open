import { useState } from "react";

const Statistics = (props) => {
  const { good, neutral, bad, sum, average, positive } = props;
  return (
    <div>
      <h1>statistics</h1>
      {sum === 0 ? (
        <p>No feedback given</p>
      ) : (
        <>
          <p>good {good}</p>
          <p>neutral {neutral}</p>
          <p>bad {bad}</p>
          <p>all {sum}</p>
          <p>average {average}</p>
          <p>positive {positive} %</p>
        </>
      )}
    </div>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const IncreaseGood = () => setGood(good + 1);
  const IncreaseNeutral = () => setNeutral(neutral + 1);
  const IncreaseBad = () => setBad(bad + 1);

  const sum = good + bad + neutral;
  const average = (good - bad) / sum;
  const positive = (good / sum) * 100;

  return (
    <>
      <div>
        <h1>give feedback</h1>
        <button onClick={IncreaseGood}>good</button>
        <button onClick={IncreaseNeutral}>neutral</button>
        <button onClick={IncreaseBad}>bad</button>
      </div>
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        sum={sum}
        average={average}
        positive={positive}
      />
    </>
  );
};

export default App;
