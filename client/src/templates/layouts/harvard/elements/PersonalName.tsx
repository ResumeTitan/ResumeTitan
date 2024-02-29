export const PersonalName = ({ name }: { name?: string }) => {
  return (
    <h3
      className="text-center text-4xl font-medium max-w overflow-hidden overflow-ellipsis whitespace-nowrap p-1"
      title={name}
    >
      {name}
    </h3>
  );
};
