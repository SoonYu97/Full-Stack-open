import { useState } from "react";

const StatisticLine = (props) => {
  const { text, value } = props;
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = (props) => {
  const { good, neutral, bad, sum, average, positive } = props;
  return (
    <div>
      <h1>statistics</h1>
      {sum === 0 ? (
        <p>No feedback given</p>
      ) : (
        <table>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={sum} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={positive} />
        </table>
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

  const Round = (num) => (Math.round(num * 100) / 100).toFixed(2);

  const sum = good + bad + neutral;
  const average = Round((good - bad) / sum);
  const positive = Round((good / sum) * 100) + ' %';

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
