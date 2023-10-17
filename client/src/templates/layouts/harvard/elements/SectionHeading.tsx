export const SectionHeading = ({ title }: { title: string }) => {
  return (
    <h3
      className="text-center text-2xl font-semibold max-w overflow-hidden overflow-ellipsis whitespace-nowrap p-1"
      title={title}
    >
      {title}
    </h3>
  );
};
