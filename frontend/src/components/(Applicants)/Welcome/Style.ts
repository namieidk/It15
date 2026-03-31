export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,700;1,800&family=Outfit:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { overflow-x: hidden; }

  @keyframes fadeUp  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes dotPing { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.6);opacity:.35} }

  .fu0 { animation: fadeUp .55s .05s both; }
  .fu1 { animation: fadeUp .55s .15s both; }
  .fu2 { animation: fadeUp .55s .28s both; }
  .fu3 { animation: fadeUp .55s .42s both; }

  .live-dot { width:7px; height:7px; border-radius:50%; animation: dotPing 2.2s infinite; }

  /* NAV */
  .nx-nav {
    position: fixed; top:0; left:0; right:0; z-index:200;
    height:68px; padding:0 2.5rem;
    display:flex; align-items:center; justify-content:space-between;
    transition: background .3s, border-color .3s, backdrop-filter .3s;
  }
  .nx-nav.stuck {
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }
  .nx-logo {
    font-family:'Playfair Display',serif; font-weight:900; font-size:1.3rem;
    letter-spacing:-.02em; display:flex; align-items:center; gap:.5rem;
    background:none; border:none; cursor:default;
  }
  .nx-nav-links { display:flex; gap:2.25rem; }
  .nx-nav-links button {
    font-family:'Outfit',sans-serif; font-size:.875rem; font-weight:500;
    background:none; border:none; cursor:pointer; transition:color .2s; padding:0;
  }
  .nx-nav-right { display:flex; align-items:center; gap:.65rem; }
  .nx-icon-btn {
    width:38px; height:38px; border-radius:10px;
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; transition:all .2s;
  }
  .nx-btn-login {
    padding:.48rem 1.1rem; border-radius:9px;
    font-family:'Outfit',sans-serif; font-size:.84rem; font-weight:500;
    cursor:pointer; transition:all .2s;
  }
  .nx-btn-signup {
    padding:.5rem 1.25rem; border-radius:9px; border:none;
    font-family:'Outfit',sans-serif; font-size:.84rem; font-weight:600;
    cursor:pointer; color:#fff; transition:all .2s;
  }
  .nx-btn-signup:hover { opacity:.87; transform:translateY(-1px); }

  /* HERO */
  .nx-hero {
    min-height:100vh; display:flex; align-items:center; justify-content:center;
    position:relative; overflow:hidden; padding:7rem 2rem 5rem;
  }
  .nx-orb {
    position:absolute; border-radius:50%; pointer-events:none;
  }
  .nx-grid {
    position:absolute; inset:0; pointer-events:none;
    background-image:
      linear-gradient(var(--gl) 1px,transparent 1px),
      linear-gradient(90deg,var(--gl) 1px,transparent 1px);
    background-size:72px 72px;
    mask-image:radial-gradient(ellipse 85% 85% at 50% 50%,black 20%,transparent 100%);
  }
  .nx-hero-inner { position:relative; z-index:1; text-align:center; max-width:820px; }
  .nx-chip {
    display:inline-flex; align-items:center; gap:.55rem;
    padding:.38rem 1.1rem; border-radius:999px;
    font-size:.73rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase;
    margin-bottom:1.75rem;
  }
  .nx-h1 {
    font-family:'Playfair Display',serif; font-weight:900;
    font-size:clamp(2.8rem,7.5vw,5.5rem); line-height:1.04;
    letter-spacing:-.03em; margin-bottom:1.5rem;
  }
  .nx-h1 em { font-style:italic; }
  .nx-hero-sub {
    font-size:clamp(.95rem,2vw,1.12rem); line-height:1.8;
    max-width:560px; margin:0 auto 2.5rem; font-weight:400;
  }
  .nx-hero-btns { display:flex; gap:1rem; justify-content:center; flex-wrap:wrap; }
  .nx-btn-primary {
    display:inline-flex; align-items:center; gap:.45rem;
    border:none; padding:.88rem 2rem; border-radius:10px;
    font-family:'Outfit',sans-serif; font-weight:600; font-size:.94rem;
    cursor:pointer; color:#fff; transition:all .25s;
  }
  .nx-btn-primary:hover { transform:translateY(-2px); }
  .nx-btn-ghost {
    display:inline-flex; align-items:center; gap:.45rem;
    background:transparent; padding:.88rem 2rem; border-radius:10px;
    font-family:'Outfit',sans-serif; font-weight:500; font-size:.94rem;
    cursor:pointer; transition:all .25s;
  }

  /* STATS */
  .nx-stats { display:flex; justify-content:center; overflow:hidden; }
  .nx-stat {
    flex:1; max-width:220px; padding:2.2rem 1.25rem; text-align:center;
    transition:background .2s; cursor:default;
  }
  .nx-stat-icon { display:flex; justify-content:center; margin-bottom:.45rem; }
  .nx-stat-val { font-family:'Playfair Display',serif; font-weight:800; font-size:2rem; line-height:1; }
  .nx-stat-lbl { font-size:.75rem; margin-top:.3rem; font-weight:500; letter-spacing:.06em; text-transform:uppercase; }

  /* SECTION */
  .nx-wrap { padding:6rem 2rem; max-width:1160px; margin:0 auto; }
  .nx-eyebrow { font-size:.73rem; font-weight:600; letter-spacing:.14em; text-transform:uppercase; margin-bottom:.55rem; }
  .nx-h2 { font-family:'Playfair Display',serif; font-weight:800; font-size:clamp(1.85rem,4vw,2.75rem); letter-spacing:-.025em; }
  .nx-sub { margin-top:.6rem; font-size:.97rem; max-width:500px; line-height:1.72; }

  /* FILTER */
  .nx-filter { display:flex; gap:.5rem; flex-wrap:wrap; margin:1.9rem 0 2.2rem; align-items:center; }
  .nx-filter-lbl { display:flex; align-items:center; gap:.35rem; font-size:.78rem; font-weight:500; margin-right:.35rem; }
  .nx-chip-btn {
    padding:.4rem .95rem; border-radius:999px;
    font-size:.78rem; font-weight:500; cursor:pointer; transition:all .2s;
    font-family:'Outfit',sans-serif;
  }

  /* JOB CARDS */
  .nx-jobs { display:grid; grid-template-columns:repeat(auto-fill,minmax(330px,1fr)); gap:1.2rem; }
  .nx-card {
    border-radius:16px; padding:1.6rem; cursor:pointer;
    transition:all .25s; position:relative; overflow:hidden;
  }
  .nx-card:hover { transform:translateY(-4px); }
  .nx-card-head { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.05rem; }
  .nx-dept-box {
    width:46px; height:46px; border-radius:12px;
    display:flex; align-items:center; justify-content:center;
  }
  .nx-badge { padding:.24rem .7rem; border-radius:999px; font-size:.68rem; font-weight:700; letter-spacing:.05em; }
  .nx-job-title { font-family:'Playfair Display',serif; font-weight:700; font-size:1.04rem; margin-bottom:.28rem; }
  .nx-job-dept  { font-size:.79rem; margin-bottom:1.05rem; }
  .nx-tags { display:flex; flex-wrap:wrap; gap:.42rem; margin-bottom:1.3rem; }
  .nx-tag {
    display:inline-flex; align-items:center; gap:.33rem;
    padding:.27rem .68rem; border-radius:7px; font-size:.73rem; font-weight:400;
  }
  .nx-card-foot { display:flex; justify-content:space-between; align-items:center; padding-top:.95rem; }
  .nx-slots { font-size:.77rem; display:flex; align-items:center; gap:.33rem; }
  .nx-btn-view {
    display:inline-flex; align-items:center; gap:.28rem;
    padding:.36rem .88rem; border-radius:8px;
    font-size:.77rem; font-weight:600; cursor:pointer; transition:all .2s;
    font-family:'Outfit',sans-serif; background:transparent;
  }

  /* WHY */
  .nx-why-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:1.2rem; margin-top:2.4rem; }
  .nx-why-card { border-radius:14px; padding:1.7rem 1.5rem; transition:transform .2s; }
  .nx-why-card:hover { transform:translateY(-3px); }
  .nx-why-icon { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; margin-bottom:.9rem; }
  .nx-why-title { font-family:'Playfair Display',serif; font-weight:700; font-size:1rem; margin-bottom:.38rem; }
  .nx-why-desc  { font-size:.84rem; line-height:1.65; }

  /* ABOUT */
  .nx-about-grid { display:grid; grid-template-columns:1fr 1fr; gap:4rem; align-items:center; }
  .nx-about-visual { border-radius:20px; padding:2rem; position:relative; overflow:hidden; }
  .nx-about-glow { position:absolute; top:-60px; right:-60px; width:200px; height:200px; border-radius:50%; pointer-events:none; }
  .nx-about-h3 { font-family:'Playfair Display',serif; font-weight:800; font-size:1.65rem; margin-bottom:.95rem; }
  .nx-about-p { font-size:.94rem; line-height:1.8; margin-bottom:.85rem; }
  .nx-dept-row { display:flex; gap:1rem; align-items:center; border-radius:10px; padding:.8rem 1rem; margin-bottom:.6rem; transition:border-color .2s; }
  .nx-dept-icon-box { width:38px; height:38px; border-radius:10px; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
  .nx-dept-name { font-weight:600; font-size:.865rem; }
  .nx-dept-sub  { font-size:.74rem; margin-top:1px; }

  /* OVERLAY / MODAL */
  .nx-overlay {
    position:fixed; inset:0; z-index:300;
    background:rgba(0,0,0,.62); backdrop-filter:blur(9px);
    display:flex; align-items:center; justify-content:center; padding:1.5rem;
  }
  .nx-modal {
    border-radius:20px; max-width:620px; width:100%; max-height:88vh;
    overflow-y:auto; padding:2.25rem; position:relative;
  }
  .nx-modal-x {
    position:absolute; top:1.1rem; right:1.1rem;
    width:34px; height:34px; border-radius:9px;
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; transition:all .2s;
  }
  .nx-modal-title { font-family:'Playfair Display',serif; font-weight:800; font-size:1.5rem; margin-bottom:.3rem; }
  .nx-modal-dept  { font-size:.84rem; margin-bottom:1.2rem; font-weight:500; }
  .nx-modal-lbl   { font-size:.71rem; text-transform:uppercase; letter-spacing:.1em; font-weight:600; margin:1.25rem 0 .5rem; }
  .nx-modal-desc  { font-size:.9rem; line-height:1.75; }
  .nx-req-list    { list-style:none; display:flex; flex-direction:column; gap:.42rem; }
  .nx-req-list li { display:flex; gap:.55rem; align-items:flex-start; font-size:.875rem; }
  .nx-modal-actions { display:flex; gap:.75rem; margin-top:1.9rem; }
  .nx-btn-apply {
    flex:1; border:none; padding:.88rem; border-radius:10px;
    font-family:'Outfit',sans-serif; font-weight:700; font-size:.94rem;
    cursor:pointer; color:#fff; transition:opacity .2s;
  }
  .nx-btn-apply:hover { opacity:.87; }

  /* FORM */
  .nx-field { margin-bottom:1.05rem; }
  .nx-field label { display:block; font-size:.79rem; font-weight:500; margin-bottom:.38rem; }
  .nx-input, .nx-textarea {
    width:100%; padding:.72rem 1rem; border-radius:10px;
    font-family:'Outfit',sans-serif; font-size:.875rem; outline:none; transition:border-color .2s;
  }
  .nx-textarea { resize:vertical; min-height:95px; }
  .nx-success { text-align:center; padding:2.5rem 1rem; }
  .nx-success-title { font-family:'Playfair Display',serif; font-weight:800; font-size:1.4rem; margin-bottom:.5rem; }
  .nx-success-sub   { font-size:.9rem; line-height:1.65; }

  /* FOOTER */
  .nx-footer-top { max-width:1160px; margin:0 auto; padding:4rem 2rem 3rem; display:grid; grid-template-columns:2fr 1fr 1fr 1.2fr; gap:3rem; }
  .nx-footer-brand { font-family:'Playfair Display',serif; font-weight:900; font-size:1.4rem; margin-bottom:.7rem; }
  .nx-footer-tagline { font-size:.875rem; line-height:1.72; max-width:280px; margin-bottom:1.45rem; }
  .nx-socials { display:flex; gap:.55rem; }
  .nx-social-btn {
    width:36px; height:36px; border-radius:9px; background:transparent;
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; transition:all .2s;
  }
  .nx-footer-col-title { font-family:'Playfair Display',serif; font-weight:700; font-size:.95rem; margin-bottom:1.2rem; }
  .nx-footer-links { list-style:none; display:flex; flex-direction:column; gap:.62rem; }
  .nx-footer-links li { font-size:.84rem; cursor:pointer; transition:color .2s; }
  .nx-contact-item { display:flex; gap:.62rem; align-items:flex-start; margin-bottom:.88rem; }
  .nx-contact-lbl  { font-size:.7rem; text-transform:uppercase; letter-spacing:.08em; font-weight:600; margin-bottom:.12rem; }
  .nx-contact-val  { font-size:.84rem; line-height:1.55; }
  .nx-footer-bottom { max-width:1160px; margin:0 auto; padding:1.4rem 2rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:.7rem; }
  .nx-footer-copy  { font-size:.77rem; }
  .nx-footer-badges { display:flex; gap:.45rem; }
  .nx-footer-badge { padding:.23rem .7rem; border-radius:999px; font-size:.68rem; }

  @media (max-width:900px) {
    .nx-footer-top   { grid-template-columns:1fr 1fr; }
    .nx-about-grid   { grid-template-columns:1fr; }
    .nx-nav-links    { display:none; }
  }
  @media (max-width:600px) {
    .nx-footer-top   { grid-template-columns:1fr; }
    .nx-btn-login    { display:none; }
    .nx-stat         { padding:1.5rem .75rem; }
  }
`;