export const PersonalName = ({ name }: { name: string }) => {
  return (
    <h3
      className="text-center text-3xl font-medium max-w overflow-hidden overflow-ellipsis whitespace-nowrap"
      title={name}
    >
      {name}
    </h3>
  );
};
