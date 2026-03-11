
import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import { SEGMENT_LABELS, HIDDEN_SEGMENTS } from '../config/route';

interface BreadcrumbItem {
  label: string;
  path: string;
  isLast: boolean;
}

// ---------------------------------------------------------------------------
// Breadcrumb component
// Renders a horizontal navigation trail that reflects the current URL.
// - Always starts with a "Home" icon linking to /dashboard
// - Skips /manage and /monitor namespace prefixes
// - Treats unknown segments (dynamic IDs) as "Details"
// - Respects pageTitle set via useBreadcrumb() for richer last-segment labels
// - Returns null when there is no meaningful hierarchy to display (e.g. /dashboard)
// ---------------------------------------------------------------------------
const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const { pageTitle } = useBreadcrumb();

  const items = useMemo((): BreadcrumbItem[] => {
    const segments = location.pathname.split('/').filter(Boolean);
    const crumbs: BreadcrumbItem[] = [];

    // Fixed root anchor — always links to dashboard
    crumbs.push({ label: 'Home', path: '/dashboard', isLast: false });

    let accumulatedPath = '';

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      accumulatedPath += `/${segment}`;

      // Skip group-only namespace prefixes that have no own page
      if (HIDDEN_SEGMENTS.has(segment)) continue;

      const label = SEGMENT_LABELS[segment];
      if (!label) continue;

      // 'settings' alone has no route; send it to the settings landing page
      const resolvedPath =
        segment === 'settings' ? '/settings/overview' : accumulatedPath;

      // Deduplicate: skip if this resolves to the same path as the last crumb
      // (happens for /settings/overview where both 'settings' and 'overview' map to the same URL)
      const lastCrumb = crumbs[crumbs.length - 1];
      if (lastCrumb && lastCrumb.path === resolvedPath) continue;

      crumbs.push({ label, path: resolvedPath, isLast: false });
    }

    // Nothing beyond "Home" was added  → we're at /dashboard or a standalone page
    if (crumbs.length <= 1) return [];

    // Mark the last item as current and apply any page-level title override
    crumbs[crumbs.length - 1] = {
      ...crumbs[crumbs.length - 1],
      isLast: true,
      label: pageTitle ?? crumbs[crumbs.length - 1].label,
    };

    return crumbs;
  }, [location.pathname, pageTitle]);

  // Nothing to render when there is no meaningful hierarchy
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 mb-6 text-sm font-medium select-none"
    >
      {items.map((item, index) => (
        <React.Fragment key={`${item.path}-${index}`}>
          {index > 0 && (
            <ChevronRight
              size={16}
              className="text-slate-300 flex-shrink-0"
              aria-hidden="true"
            />
          )}

          {/* Home crumb — icon only */}
          {index === 0 ? (
            <Link
              to={item.path}
              className="text-slate-400 hover:text-slate-600 transition-colors duration-150 flex-shrink-0"
              aria-label="Home"
            >
              <Home size={18} />
            </Link>
          ) : item.isLast ? (
            /* Current page — not a link */
            <span
              className="text-slate-800 font-semibold truncate max-w-[280px]"
              title={item.label}
              aria-current="page"
            >
              {item.label}
            </span>
          ) : (
            /* Ancestor crumb — clickable */
            <Link
              to={item.path}
              className="text-slate-400 hover:text-slate-700 transition-colors duration-150 truncate max-w-[200px] whitespace-nowrap"
              title={item.label}
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
