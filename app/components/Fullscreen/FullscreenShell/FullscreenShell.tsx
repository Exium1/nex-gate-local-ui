import "./FullscreenShell.scss";

export type FullscreenShellProps = {
  header: React.ReactNode,
  children: React.ReactNode,
  footer: React.ReactNode,
}


export default function FullscreenShell({header, footer, children}: FullscreenShellProps) {
  return <div className="fullscreen-shell">
    <div className="fullscreen-shell__header">{header}</div>
    <div className="fullscreen-shell__content">{children}</div>
    <div className="fullscreen-shell__footer">{footer}</div>
  </div>
}