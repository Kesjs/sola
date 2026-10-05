import { Link } from '@tanstack/react-router'
export default function Header() {
  return <header className="sola-header"><nav><Link to="/app" className="brand"><span className="brand-mark">S</span><span>Sola</span></Link><span className="header-context">Assistant</span></nav></header>
}
