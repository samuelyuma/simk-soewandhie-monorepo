import { Link } from "@tanstack/react-router";
import { ChevronDown, File } from "lucide-react";
import { Fragment } from "react/jsx-runtime";

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
} from "../ui/dropdown-menu";

type NavigationProps = {
  navItems: {
    title: string;
    link?: string;
    subtitle?: string;
    items: {
      title: string;
      icon?: React.ElementType;
      link?: string;
      items?: {
        title: string;
        link: string;
        icon?: React.ElementType;
      }[];
    }[];
  }[];
};

const Navigation = ({ navItems }: NavigationProps) => {
  return (
    <div className="flex space-x-10">
      {navItems.map((item) =>
        item.items.length === 0 ? (
          <Link to={item.link} key={item.title}>
            <p className="font-medium">{item.title}</p>
          </Link>
        ) : (
          <DropdownMenu key={item.title}>
            <DropdownMenuTrigger>
              <Link className="flex items-center gap-1" to={item.link}>
                <p className="font-medium">{item.title}</p>
                <ChevronDown size={16} />
              </Link>
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
                        <DropdownMenuLabel>{subItem.title}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {subItem.items.map((subSubItem, index) => (
                          <DropdownMenuItem key={index}>
                            <Link
                              className="flex w-full items-center gap-1"
                              to={subSubItem.link}
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
                        to={subItem.link}
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
        ),
      )}
    </div>
  );
};

export default Navigation;
