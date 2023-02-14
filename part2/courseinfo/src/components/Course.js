const Header = ({ course }) => <h1>{course}</h1>;

const Total = ({ sum }) => (
  <p>
    <b>total of {sum} exercises</b>
  </p>
);

const Part = ({ name, exercises }) => (
  <p>
    {name} {exercises}
  </p>
);

const Content = ({ parts }) => {
  return (
    <>
      {parts.map(({ id, name, exercises }) => {
        return <Part key={id} name={name} exercises={exercises} />;
      })}
    </>
  );
};

const Course = ({ course }) => {
  const { name, parts } = course;
  const total = parts.reduce((acc, curr) => acc + curr.exercises, 0);
  return (
    <>
      <Header course={name} />
      <Content parts={parts} />
      <Total sum={total} />
    </>
  );
};

export default Course;
