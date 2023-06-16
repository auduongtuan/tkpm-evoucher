import Link from "./Link";
const SectionTitle = ({
  title,
  moreLink,
}: {
  title: React.ReactNode;
  moreLink?: string;
}) => {
  return (
    <div className="flex items-center">
      <div className="text-xl font-semibold grow">{title}</div>
      {moreLink && <Link to={moreLink}>View more</Link>}
    </div>
  );
};
export default SectionTitle;
