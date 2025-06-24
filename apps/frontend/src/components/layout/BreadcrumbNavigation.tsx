import { Link } from "@tanstack/react-router";
import { File } from "lucide-react";
import { memo } from "react";
import { Fragment } from "react/jsx-runtime";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type BreadcrumbNavigationProps = {
  breadcrumbItems: {
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
  }[];
};

const BreadcrumbNavigation = memo(
  ({ breadcrumbItems }: BreadcrumbNavigationProps) => {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <Fragment key={index}>
              <BreadcrumbItem key={index}>
                {item.href ? (
                  <BreadcrumbLink href={item.href}>{item.title}</BreadcrumbLink>
                ) : item.items ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex cursor-pointer items-center justify-center space-x-0.5 font-medium">
                      {item.title}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>{item.subtitle}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {item.items.map((subItem, index) => (
                        <Fragment key={index}>
                          {subItem.items ? (
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger className="flex w-full items-center gap-1">
                                <File size={16} />
                                <p>{subItem.title}</p>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                <DropdownMenuLabel>
                                  {subItem.title}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {subItem.items.map((subSubItem, index) => (
                                  <DropdownMenuItem key={index}>
                                    <Link
                                      className="flex w-full items-center gap-1"
                                      to={subSubItem.href}
                                    >
                                      {subSubItem.icon ? (
                                        <subSubItem.icon size={16} />
                                      ) : (
                                        <File size={16} />
                                      )}
                                      <p>{subSubItem.title}</p>
                                    </Link>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                          ) : (
                            <DropdownMenuItem>
                              <Link
                                className="flex w-full items-center gap-1"
                                to={subItem.href}
                              >
                                {subItem.icon ? (
                                  <subItem.icon size={16} />
                                ) : (
                                  <File size={16} />
                                )}
                                <p>{subItem.title}</p>
                              </Link>
                            </DropdownMenuItem>
                          )}
                        </Fragment>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <BreadcrumbPage>{item.title}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    );
  },
);

export default BreadcrumbNavigation;
