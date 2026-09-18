import type { Category } from "@shared/types/Category";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getCategories } from "../../api/categoryService";

function NavBar() {
  const [categories, setCategories] = useState<Category[]>([]);

  const [searchParams] = useSearchParams();
  const selectedCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    async function loadCategories() {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Greška pri učitavanju kategorija.", error);
      }
    }

    loadCategories();
  }, []);

  return (
    <nav className="flex flex-row gap-10 ">
      {categories &&
        categories.map((category) => (
          <Link
            key={category.id}
            to={`/events?categoryId=${category.id}`}
            className={`border-b-2 pb-1 transition-all duration-200 ${
              selectedCategoryId === category.id
                ? "border-white text-white"
                : "border-transparent text-white/80 hover:text-white"
            }`}
          >
            {category.categoryName}
          </Link>
        ))}
    </nav>
  );
}
export default NavBar;
