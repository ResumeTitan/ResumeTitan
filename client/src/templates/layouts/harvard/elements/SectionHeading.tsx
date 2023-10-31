export const SectionHeading = ({ title }: { title: string }) => {
  return (
    <h3
      className="text-center text-2xl font-semibold max-w overflow-hidden overflow-ellipsis whitespace-nowrap p-[0.05rem]"
      title={title}
    >
      {title}
    </h3>
  );
};
