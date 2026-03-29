import "./Header.scss"

export type HeaderProps = {
  title: string;
}

export default function Header({title} : HeaderProps) {
  return <div className="header"><h4>{title}</h4></div>
}