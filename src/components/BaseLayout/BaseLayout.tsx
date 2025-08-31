import Link from "next/link";
import { ReactNode } from "react";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BaseLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  title?: string;
}

export default function BaseLayout({
  children,
  breadcrumbs = [],
  title,
}: BaseLayoutProps) {
  return (
    <section className="flex flex-col items-start mx-auto">
      {/* Theme Switcher */}
      <ThemeSwitcher />

      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <div className="flex flex-row gap-2 items-start">
          {breadcrumbs.map((breadcrumb, index) => (
            <Link
              key={index}
              href={breadcrumb.href}
              className="my-4 font-bold bg-gray-400 dark:bg-gray-600 text-gray-900 dark:text-gray-100 p-2 rounded text-sm md:text-base transition-colors duration-200"
            >
              {breadcrumb.label}
            </Link>
          ))}
        </div>
      )}

      <div className="w-full">
        {/* Title */}
        {title && (
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-gray-500 transition-colors duration-200">
            {title}
          </h2>
        )}

        {/* Content */}
        {children}
      </div>
    </section>
  );
}
