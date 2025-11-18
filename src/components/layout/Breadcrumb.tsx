import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { flattenRoutes, routes } from '@/routes/routes';

export default function Breadcrumb() {
  const location = useLocation();
  const flatRoutes = flattenRoutes(routes);

  // 获取当前路径的面包屑
  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: Array<{ title: string; path: string }> = [];

    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const route = flatRoutes.find((r) => r.path === currentPath);
      if (route?.meta?.title) {
        breadcrumbs.push({
          title: route.meta.title,
          path: currentPath,
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
      <Link
        to="/dashboard"
        className="flex items-center hover:text-foreground"
      >
        <Home className="h-4 w-4" />
      </Link>

      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.path} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4" />
          {index === breadcrumbs.length - 1 ? (
            <span className="font-medium text-foreground">{crumb.title}</span>
          ) : (
            <Link
              to={crumb.path}
              className="hover:text-foreground"
            >
              {crumb.title}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
