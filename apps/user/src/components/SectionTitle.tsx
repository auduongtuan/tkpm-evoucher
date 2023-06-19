import { Link } from "ui";
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
      {moreLink && (
        <Link to={moreLink} preventScrollReset={false}>
          View more
        </Link>
      )}
    </div>
  );
};
export default SectionTitle;
