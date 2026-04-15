import { useState, lazy, Suspense } from 'react';
import "./styles/index.css"
import {
  FaJava, FaNodeJs, SiSpringboot, SiJavascript, SiHtml5,
  SiReact, SiMysql, SiGithub, SiPython, SiFigma,
  IoLogoCss3, LuLayers, LuKanban, LuExternalLink
} from "./components/Icons"; 
import fotopessoal from "./assets/fotopessoal.webp" 
import webapplogin from "./assets/projetosimage/sistemaloginweb.webp"
import cencosudtraining from "./assets/projetosimage/cencosudtraining.webp"
import { ScrollReveal } from "./components/ScrollReveal"
import HeroSection from "./components/HeroSection"
import ExternalLink from "./components/ExternalLink"
const ProjectCarousel = lazy(() => import("./components/ProjectCarousel"));
import { useLanguage } from "./i18n/useLanguage"
import { isInAppBrowser } from "./lib/browser.js"

const Portfolio = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { lang, t, toggleLang } = useLanguage();

  const handleCvClick = (e) => {
    e.preventDefault();
    const cvUrl = `${import.meta.env.BASE_URL}Curriculo.pdf`;

    // Em WebViews, window.open() retorna null ou abre na aba atual — skip.
    // Em browsers padrão, abre o PDF em nova aba normalmente.
    if (!isInAppBrowser()) {
      const newTab = window.open(cvUrl, '_blank');
      if (newTab) newTab.opener = null;
    }

    const link = document.createElement('a');
    link.href = cvUrl;
    link.download = 'Curriculo.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="container">
      {/* Header / Menu */}
      <nav className="navbar" aria-label={lang === 'pt' ? 'Navegação principal' : 'Main navigation'}>
        <div className="logo">PORTFÓLIO</div>
        <ul className="nav-links">
          <li><a href="/Curriculo.pdf" onClick={handleCvClick}>{t.nav.cv}</a></li>
          <li><a href="#about">{t.nav.about}</a></li>
          <li><a href="#projects">{t.nav.projects}</a></li>
          <li><a href="#skills">{t.nav.skills}</a></li>
          <li
            className="nav-contact-wrapper"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
            onFocus={() => setShowDropdown(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setShowDropdown(false);
            }}
          >
            <a href="#contact">{t.nav.contact}</a>
            <ul className={`contact-dropdown ${showDropdown ? 'active' : ''}`} role="menu" aria-label={lang === 'pt' ? 'Links de contato' : 'Contact links'}>
              <li role="none"><ExternalLink href="https://www.linkedin.com/in/lucasnsnt/" role="menuitem" tabIndex={0}>LinkedIn</ExternalLink></li>
              <li role="none"><ExternalLink href="https://github.com/lucasnsnt/" role="menuitem" tabIndex={0}>GitHub</ExternalLink></li>
              <li role="none"><ExternalLink href="https://links.lucasnsnt.ink" role="menuitem" tabIndex={0}>Meus Links</ExternalLink></li>
            </ul>
          </li>
          <li>
            <button className="lang-toggle" onClick={toggleLang} aria-label={lang === 'pt' ? 'Mudar para inglês' : 'Switch to Portuguese'}>
              {lang === 'pt' ? 'EN' : 'PT'}
            </button>
          </li>
        </ul>
      </nav>

      <main>
      <HeroSection />

      {/* About*/}
      <section id='about' className="about-section">
        <div className="about-container">
          
      
          <div className="about-content">
            <ScrollReveal direction="diagonal">
              <h2 className="about-main-title">{t.about.title}</h2>
              <h3 className="about-subtitle">{t.about.subtitle}</h3>
            </ScrollReveal>
            
            <ScrollReveal direction="left" delay={2}>
            <p className="about-description">
              {t.about.description}
            </p>

            <div className="btn-talk-wrapper">
              <a href="#contact" className="btn-talk">
                {t.about.btnContact}
              </a>
              <a href="/Curriculo.pdf" onClick={handleCvClick} className="btn-talk btn-download">
                {t.about.btnCv}
              </a>
            </div>
            </ScrollReveal>
          </div>

       
          <ScrollReveal direction="flip">
          <div className="about-image-wrapper">
            <div className="photo-frame">
              <img src={fotopessoal} alt={t.about.imgAlt} width={500} height={500} loading="lazy" />
            </div>
          </div>
          </ScrollReveal>

        </div>
      </section>

      {/* Projetos */}
      <section id="projects" className="section projects-section">
        <ScrollReveal direction="spread">
        <div className="projects-header">
          <h2 className="section-title">{t.projects.title}</h2>
          <p className="section-subtitle">{t.projects.subtitle}</p>
        </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={1}>
          <Suspense fallback={<div style={{minHeight: '300px'}} />}>
            <ProjectCarousel
              projects={[
                {
                  image: cencosudtraining,
                  alt: t.projects.cencosud.alt,
                  name: t.projects.cencosud.name,
                  desc: t.projects.cencosud.desc,
                  imageClass: 'mobile',
                },
                {
                  image: webapplogin,
                  alt: t.projects.login.alt,
                  name: t.projects.login.name,
                  desc: t.projects.login.desc,
                  imageClass: 'mobile',
                },
              ]}
            />
          </Suspense>
        </ScrollReveal>
      </section>

      <section id='skills' className="skills-section">
        <div className="skills-container">
         
          <ScrollReveal direction="diagonal">
          <div className="skills-content">
            <h2 className="skills-title">{t.skills.title}</h2>
            <p className="skills-description">
              {t.skills.description}
            </p>
            <div className="capabilities-tags">
              {t.skills.tags}
            </div>
          </div>
          </ScrollReveal>

         
          <div className="skills-grid-wrapper">
            <div className="skills-grid">

              <ScrollReveal direction="scale" delay={1}>
              <div className="skill-card">
                <div className="skill-icon-placeholder">
                  <SiReact size={40} />
                </div>
                <span className="skill-name">React</span>
              </div>
              </ScrollReveal>

              <ScrollReveal direction="scale" delay={2}>
              <div className="skill-card">
                <div className="skill-icon-placeholder">
                  <FaJava size={40}/>
                </div>
                <span className="skill-name">JAVA</span>
              </div>
              </ScrollReveal>

              <ScrollReveal direction="scale" delay={3}>
              <div className="skill-card">
                <div className="skill-icon-placeholder">
                  <FaNodeJs size={40}/>
                </div>
                <span className="skill-name">NODE</span>
              </div>
              </ScrollReveal>

              <ScrollReveal direction="scale" delay={4}>
              <div className="skill-card">
                <div className="skill-icon-placeholder">
                  <SiSpringboot size={40} />
                </div>
                <span className="skill-name">SPRINGBOOT</span>
              </div>
              </ScrollReveal>

              <ScrollReveal direction="scale" delay={5}>
              <div className="skill-card">
                <div className="skill-icon-placeholder">
                  <SiPython size={40} />
                </div>
                <span className="skill-name">Python</span>
              </div>
              </ScrollReveal>

              <ScrollReveal direction="scale" delay={6}>
              <div className="skill-card">
                <div className="skill-icon-placeholder">
                  <SiJavascript size={40} />
                </div>
                <span className="skill-name">JavaScript</span>
              </div>
              </ScrollReveal>

              <ScrollReveal direction="scale" delay={7}>
              <div className="skill-card">
                <div className="skill-icon-placeholder">
                  <SiHtml5 size={40} /> <IoLogoCss3 size={40} />
                </div>
                <span className="skill-name">HTML/CSS</span>
              </div>
              </ScrollReveal>
              
              <ScrollReveal direction="scale" delay={8}>
              <div className="skill-card">
                <div className="skill-icon-placeholder">
                  <SiMysql size={40} />
                </div>
                <span className="skill-name"> {t.skills.items.mysql} </span>
              </div>
              </ScrollReveal>

              <ScrollReveal direction="scale" delay={9}>
              <div className="skill-card">
                <div className="skill-icon-placeholder">
                  <SiGithub size={40} />
                </div>
                <span className="skill-name"> {t.skills.items.git} </span>
              </div>
              </ScrollReveal>

              <ScrollReveal direction="scale" delay={10}>
              <div className="skill-card">
                <div className="skill-icon-placeholder">
                  <SiFigma size={40} />
                </div>
                <span className="skill-name"> {t.skills.items.uiux} </span>
              </div>
              </ScrollReveal>

              <ScrollReveal direction="scale" delay={11}>
              <div className="skill-card">
                <div className="skill-icon-placeholder">
                  <LuLayers size={40} />
                </div>
                <span className="skill-name"> {t.skills.items.architecture} </span>
              </div>
              </ScrollReveal>

              <ScrollReveal direction="scale" delay={12}>
              <div className="skill-card">
                <div className="skill-icon-placeholder">
                  <LuKanban size={40} />
                </div>
                <span className="skill-name"> {t.skills.items.agile} </span>
              </div>
              </ScrollReveal>


            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section contact-section">
        <ScrollReveal direction="flip">
          <h2 className="section-title" style={{ textAlign: 'center' }}>{t.contact.title}</h2>
        </ScrollReveal>
        <div className="contact-links">
          <ScrollReveal direction="wipe" delay={1}>
            <ExternalLink href="https://github.com/lucasnsnt/" className="contact-item">GITHUB <LuExternalLink className="external-link-icon" aria-hidden="true" /></ExternalLink>
          </ScrollReveal>
          <ScrollReveal direction="wipe" delay={3}>
            <ExternalLink href="https://www.linkedin.com/in/lucasnsnt/" className="contact-item">LINKEDIN <LuExternalLink className="external-link-icon" aria-hidden="true" /></ExternalLink>
          </ScrollReveal>
          <ScrollReveal direction="wipe" delay={5}>
            <a href="mailto:lucasnsntcontato@outlook.com" className="contact-item" target='_blank' rel='noopener noreferrer'>EMAIL <LuExternalLink className="external-link-icon" aria-hidden="true" /></a>
          </ScrollReveal>
          <ScrollReveal direction="wipe" delay={5}>
            <ExternalLink href="https://links.lucasnsnt.ink/" className="contact-item" aria-label="Abrir árvore de links em nova guia">
              MEUS LINKS <LuExternalLink className="external-link-icon" aria-hidden="true" />
            </ExternalLink>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      </main>
      <footer className="footer">
        <p>{t.footer}</p>
      </footer>
    </div>
  );
};

export default Portfolio;