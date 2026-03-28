import { type AriaAttributes } from "react";
import "./Button.scss";

export type ButtonProps = {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  color?: "primary" | "neutral" | "success" | "danger" | "warning";
  variant?: "plain" | "outlined" | "solid";
  size?: "xs" |"sm" | "md" | "lg" | "xl";
  className?: string;
  loading?: boolean;
  loadingText?: string;
  type?: "button" | "submit" | "reset";
  tooltip?: string;
  // fullWidth?: boolean;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size"> & AriaAttributes;

export default function Button({
  onClick,
  disabled = false,
  variant = "solid",
  size = "md",
  children,
  className="",
  loading = false,
  loadingText = "Loading...",
  type = "button",
  style,
  tooltip,
  color="primary",
  ...props
}: ButtonProps) {
  const compiledClassName = `button button--${variant} button--${size} button--full-width button--${color}`;

  return (
    <button
      className={compiledClassName}
      onClick={onClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      type={type}
      style={style}
      {...(loading ? { "aria-busy": true } : {})}
      {...props}
    >
      {children}
    </button>
  ) 
}