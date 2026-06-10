const CATEGORIES = [
  { id: "all", name: "Tous" },
  { id: "moroccan", name: "Marocain" },
  { id: "mediterranean", name: "Méditerranéen" },
  { id: "oriental", name: "Oriental" },
  { id: "desserts", name: "Desserts" },
];

export function CategoryTabs({
  dishes = [],
  selectedCategory,
  setSelectedCategory,
  setCurrentPage,
}) {
  const categories = CATEGORIES.map((category) => ({
    ...category,
    count:
      category.id === "all"
        ? dishes.length
        : dishes.filter((dish) => dish.category === category.id).length,
  }));

  return (
    <div className="mb-6 overflow-x-auto pb-2">
      <div className="flex gap-3 min-w-max sm:min-w-0">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setSelectedCategory(category.id);
              setCurrentPage(1);
            }}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all font-medium whitespace-nowrap ${
              selectedCategory === category.id
                ? "bg-primary  text-white shadow-md scale-105"
                : "bg-white  hover:bg-white hover:border-primary/30"
            }`}
          >
            {category.name}
            <span className="ml-2 text-xs opacity-75">({category.count})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
