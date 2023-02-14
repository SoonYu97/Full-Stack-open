import Part from "./Part";

const Content = ({ parts }) => {
  return (
    <>
      {parts.map(({ name, exercises }, idx) => {
        return <Part key={idx} name={name} exercises={exercises} />;
      })}
    </>
  );
};

export default Content;
