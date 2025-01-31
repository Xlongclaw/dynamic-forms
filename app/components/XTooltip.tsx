import React, { ReactNode } from "react";

interface TooltipProps {
  text?: string;
  position?: "top" | "bottom" | "left" | "right";
  children: ReactNode;
  innerChildren?: ReactNode;
  type?: "text" | "jsx";
}

const XTooltip: React.FC<TooltipProps> = ({
  text,
  position = "top",
  children,
  innerChildren,
  type = "text",
}) => {
  const [hovered, setHovered] = React.useState<boolean>(false);

  return (
    <div className="relative group inline-block">
      {/* Tooltip Content */}
      <div
        className={`  ${
          hovered ? "opacity-100" : "opacity-0 pointer-events-none"
        }  absolute whitespace-nowrap bg-gray-900 text-white text-xs px-3 py-1 rounded-md shadow-lg transition-opacity duration-200 opacity-0 
        ${
          position === "top" ? "bottom-full left-1/2 -translate-x-1/2 mb-2" : ""
        }
        ${
          position === "bottom" ? "top-full left-1/2 -translate-x-1/2 mt-2" : ""
        }
        ${position === "left" ? "right-full top-1/2 -translate-y-1/2 mr-2" : ""}
        ${
          position === "right" ? "left-full top-1/2 -translate-y-1/2 ml-2" : ""
        }`}
      >
        {type == "text" ? text : innerChildren}
      </div>

      {/* Wrapped Children */}
      <div
        onMouseOver={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className=""
      >
        {children}
      </div>
    </div>
  );
};

export default XTooltip;
