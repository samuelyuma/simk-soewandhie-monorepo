import BreadcrumbNavigation from "./BreadcrumbNavigation";

type BreadcrumbItems = {
  title: string;
  subtitle?: string;
  href?: string;
  items?: {
    title: string;
    href?: string;
    icon?: React.ElementType;
    items?: {
      title: string;
      href: string;
      icon?: React.ElementType;
    }[];
  }[];
};

type PageHeaderProps = {
  breadcrumbItems: BreadcrumbItems[];
  pageTitle: string;
};

const PageHeader = ({ pageTitle, breadcrumbItems }: PageHeaderProps) => {
  return (
    <div>
      <div className="flex items-center gap-10">
        <p className="font-bold text-3xl">{pageTitle}</p>

        <BreadcrumbNavigation breadcrumbItems={breadcrumbItems} />
      </div>
    </div>
  );
};

export default PageHeader;
