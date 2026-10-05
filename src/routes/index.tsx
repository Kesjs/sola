import { Link } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Landing })

function Landing() {
  return <main className="landing-page">
    <section className="landing-hero"><div className="hero-copy"><p className="eyebrow">LE WALLET SOLANA QUI EXPLIQUE</p><h1>La crypto, enfin lisible.</h1><p className="hero-lede">Sola vous aide à comprendre vos actifs et à préparer vos opérations. Vous vérifiez. Vous signez. Vous gardez le contrôle.</p><div className="hero-actions"><Link to="/connexion" className="primary-action">Commencer avec Sola <span>↗</span></Link><a href="#how" className="text-link">Voir comment ça marche <span>↓</span></a></div></div><div className="hero-object"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="phone-card"><div className="phone-top"><span>Sola</span><span className="status-dot" /></div><span className="phone-label">VALEUR DU WALLET</span><strong>2 846,20 €</strong><div className="phone-chart"><i /><i /><i /><i /><i /><i /><i /></div><div className="phone-row"><span>Solana</span><b>8,42 SOL</b></div><div className="phone-row"><span>Tether USD</span><b>1 597,70 USDT</b></div></div><span className="hero-note note-one">Données réelles</span><span className="hero-note note-two">Toujours vérifiable</span></div></section>
    <section id="how" className="landing-proof"><div><p className="eyebrow">UNE BOUCLE SIMPLE</p><h2>Comprendre avant d’agir.</h2></div><div className="proof-steps"><div><span>01</span><strong>Connectez</strong><p>Votre wallet Solana, jamais votre phrase secrète.</p></div><div><span>02</span><strong>Préparez</strong><p>Un envoi ou un échange avec les bons frais.</p></div><div><span>03</span><strong>Vérifiez</strong><p>Chaque détail avant de signer dans votre wallet.</p></div></div></section>
    <section className="landing-final"><p className="eyebrow">VOTRE CONTRÔLE, TOUJOURS</p><h2>Un assistant qui aide à agir,<br />pas à décider à votre place.</h2><Link to="/connexion" className="secondary-action">Découvrir mon espace <span>↗</span></Link></section>
    <footer className="landing-footer"><span>© Sola</span><span>Non-custodial · Solana</span></footer>
  </main>
}
