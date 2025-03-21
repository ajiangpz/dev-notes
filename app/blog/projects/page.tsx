import projectsData from "@/data/projectsData";
import { genPageMetadata } from "@/app/blog/seo";

export const metadata = genPageMetadata({ title: "Projects" });

export default function Projects() {
  // 将项目按类别分组
  const categories = {
    "AI & 工具": projectsData.filter((p) => p.category === "ai"),
    算法可视化: projectsData.filter((p) => p.category === "algorithm"),
    画布实验: projectsData.filter((p) => p.category === "canvas"),
    游戏: projectsData.filter((p) => p.category === "game"),
  };

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            项目展示
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            探索有趣的前端实验和工具集
          </p>
        </div>

        <div className="container py-12">
          {Object.entries(categories).map(([category, projects]) => (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <a
                    key={project.title}
                    href={`/projects/${project.slug}`}
                    className="transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="h-full overflow-hidden rounded-lg border-2 border-gray-200 border-opacity-60 dark:border-gray-700">
                      {project.imgSrc && (
                        <img
                          alt={project.title}
                          src={project.imgSrc}
                          className="h-48 w-full object-cover object-center"
                        />
                      )}
                      <div className="p-6">
                        <h2 className="mb-3 text-2xl font-bold leading-8 tracking-tight text-gray-900 dark:text-gray-100">
                          {project.title}
                        </h2>
                        <p className="prose mb-3 max-w-none text-gray-500 dark:text-gray-400">
                          {project.description}
                        </p>
                        <div className="flex items-center gap-3">
                          {project.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center rounded-full bg-gray-100 px-3 py-0.5 text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
