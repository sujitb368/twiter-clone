export const nameFunction = (name) => {
  name?.trim();
  if (name === null || name === undefined || name === "") return;
  let arr = name?.split(" ");

  const upperCaseName = arr.map(
    (elm) => elm.at(0).toUpperCase() + elm.slice(1)
  );

  return upperCaseName.join(" ");
};
