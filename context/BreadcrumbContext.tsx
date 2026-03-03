
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface BreadcrumbContextType {
  /** Override the label for the last breadcrumb segment (e.g. an employee name instead of "Details") */
  pageTitle: string | null;
  setPageTitle: (title: string | null) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType>({
  pageTitle: null,
  setPageTitle: () => {},
});

/** Internal shape — title is bound to the path it was set on. */
interface TitleEntry {
  path: string;
  title: string;
}

/**
 * Wraps a subtree and provides breadcrumb title override support.
 * Must be rendered inside a React Router context (already satisfied by Layout).
 *
 * The title is path-aware: it is only considered valid when the current
 * pathname matches the path it was registered for. This means no reset effect
 * is required — stale titles are discarded synchronously on route change,
 * eliminating the flash of an old title on the incoming page.
 */
export const BreadcrumbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [titleEntry, setTitleEntry] = useState<TitleEntry | null>(null);

  // A ref that always holds the latest pathname without being a useCallback dep.
  // This keeps setPageTitle referentially stable so that consumer useEffects
  // (e.g. in ReportDetail) never re-fire merely because the location changed.
  // Without this, AnimatePresence's exit animation keeps the outgoing page
  // mounted while the location has already updated, causing that page's effect
  // to re-run with the new path and stamp the incoming page's title entry.
  const pathnameRef = useRef(location.pathname);
  pathnameRef.current = location.pathname;

  const setPageTitle = useCallback((title: string | null) => {
    setTitleEntry(title === null ? null : { path: pathnameRef.current, title });
  }, []); // stable for the lifetime of the provider

  // Derived synchronously — no effect needed.
  // If the stored path no longer matches the current path, treat as null.
  const pageTitle = titleEntry?.path === location.pathname ? titleEntry.title : null;

  return (
    <BreadcrumbContext.Provider value={{ pageTitle, setPageTitle }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

/**
 * Returns breadcrumb context. Call `setPageTitle` inside a `useEffect` in any
 * detail page to replace the auto-generated "Details" label with a real name.
 *
 * @example
 * const { setPageTitle } = useBreadcrumb();
 * useEffect(() => { if (employee) setPageTitle(employee.name); }, [employee]);
 */
export const useBreadcrumb = () => useContext(BreadcrumbContext);
