export const SectionTitle = ({ label }: { label: string }) => {
  return (
    <h3
      className="text-left text-xl font-semibold max-w overflow-hidden overflow-ellipsis whitespace-nowrap p-1"
      title={label}
    >
      {label}
    </h3>
  );
};
