import { Category } from "database";
import { uniqBy } from "helpers";
import Link from "./Link";
const CategoryLinks = ({ categories }: { categories: Category[] }) => {
  const uniqCategories = uniqBy(
    categories,
    (category: Category) => category.id
  );
  return (
    <div className="text-base">
      {uniqCategories.reduce<React.ReactNode[]>((acc, category, i) => {
        acc.push(
          <Link
            to={`/stores?categoryId=${category.id}`}
            className="underline underline-offset-4 decoration-gray-200"
            key={"category-tag" + category.id}
          >
            {category.name}
          </Link>
        );
        if (i < uniqCategories.length - 1) {
          acc.push(", ");
        }
        return acc;
      }, [])}
    </div>
  );
};
export default CategoryLinks;
