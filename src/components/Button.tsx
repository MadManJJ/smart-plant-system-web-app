import { useState } from "react";

export const Button = ({
  onClick,
  children,
  variant = "primary",
  disabled = false,
}: {
  onClick: (() => void) | undefined;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const getStyles = () => {
    const baseStyles = {
      padding: "12px 24px",
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.2s ease",
      border: "none",
      outline: "none",
      fontFamily: "inherit",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: disabled ? 0.5 : 1,
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    };

    const variants = {
      primary: {
        backgroundColor: "#22c55e",
        color: "white",
        hoverBackground: "#16a34a",
        activeBackground: "#15803d",
      },
      secondary: {
        backgroundColor: "white",
        color: "#333",
        hoverBackground: "#f9fafb",
        activeBackground: "#f3f4f6",
      },
      outline: {
        backgroundColor: "transparent",
        color: "#22c55e",
        border: "2px solid #22c55e",
        hoverBackground: "rgba(34, 197, 94, 0.05)",
        activeBackground: "rgba(34, 197, 94, 0.1)",
      },
    };

    return { ...baseStyles, ...variants[variant] };
  };

  const styles = getStyles();
  const currentBackground = isActive
    ? styles.activeBackground
    : isHovered
    ? styles.hoverBackground
    : variant === "outline"
    ? styles.backgroundColor
    : styles.backgroundColor;

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => !disabled && setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      style={{
        ...styles,
        backgroundColor: currentBackground,
        border: variant === "outline" ? styles.border : "none",
        transform: isHovered && !disabled ? "translateY(-1px)" : "translateY(0)",
        boxShadow: isHovered && !disabled
          ? "0 4px 8px rgba(0,0,0,0.1)"
          : "0 2px 4px rgba(0,0,0,0.05)",
      }}
    >
      {children}
    </button>
  );
};
