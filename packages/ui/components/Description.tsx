const Description = ({
  label,
  children,
  ...rest
}: React.ComponentPropsWithoutRef<"div"> & {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <div {...rest}>
      <div className="mb-1.5 text-sm text-gray-600">{label}</div>
      <div>{children}</div>
    </div>
  );
};
export default Description;
