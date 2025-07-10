import React from 'react';
interface BreadcrumbsProps {
  items: string[];
}
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => (
  <nav className="mb-4 text-gray-500 text-sm" aria-label="Breadcrumb">
    {items.map((item, i) => (
      <span key={i}>
        {i > 0 && <span className="mx-1">/</span>}
        <span className={i === items.length - 1 ? "text-gray-900 font-medium" : ""}>{item}</span>
      </span>
    ))}
  </nav>
);
Breadcrumbs.displayName = "Breadcrumbs";
export default Breadcrumbs;
