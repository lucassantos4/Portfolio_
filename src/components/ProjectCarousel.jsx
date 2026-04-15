import { useState, useCallback, useRef, useLayoutEffect } from 'react';
import { LuChevronLeft, LuChevronRight } from './Icons';

const ProjectCarousel = ({ projects }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(null);
  const [direction, setDirection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef(null);
  const viewportRef = useRef(null);
  const currentSlideRef = useRef(null);
  const incomingSlideRef = useRef(null);

  const total = projects.length;

  // Smoothly animate viewport height when content changes
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    if (isAnimating && incomingSlideRef.current) {
      // Lock to current height, then transition to incoming height
      const incomingHeight = incomingSlideRef.current.offsetHeight;
      viewport.style.height = `${viewport.offsetHeight}px`;
      requestAnimationFrame(() => {
        viewport.style.height = `${incomingHeight}px`;
      });
    } else if (!isAnimating && currentSlideRef.current) {
      // After animation ends, set to new current height then release
      viewport.style.height = `${currentSlideRef.current.offsetHeight}px`;
      const onEnd = () => { viewport.style.height = ''; };
      viewport.addEventListener('transitionend', onEnd, { once: true });
      // Fallback in case transitionend doesn't fire
      const fallback = setTimeout(onEnd, 800);
      return () => { clearTimeout(fallback); viewport.removeEventListener('transitionend', onEnd); };
    }
  }, [isAnimating, currentIndex, nextIndex]);

  const goTo = useCallback((newIndex, dir) => {
    if (isAnimating || newIndex === currentIndex) return;
    clearTimeout(timeoutRef.current);

    setNextIndex(newIndex);
    setDirection(dir);
    setIsAnimating(true);

    timeoutRef.current = setTimeout(() => {
      setCurrentIndex(newIndex);
      setNextIndex(null);
      setDirection(null);
      setIsAnimating(false);
    }, 750);
  }, [isAnimating, currentIndex]);

  const goNext = () => goTo((currentIndex + 1) % total, 'next');
  const goPrev = () => goTo((currentIndex - 1 + total) % total, 'prev');

  const currentProject = projects[currentIndex];
  const incomingProject = nextIndex !== null ? projects[nextIndex] : null;

  const renderCard = (project) => (
    <div className="project-card">
      <div className={`project-image-container ${project.imageClass || 'mobile'}`}>
        <img
          src={project.image}
          alt={project.alt}
          className="project-screenshot"
          width={800}
          height={550}
          loading="lazy"
        />
      </div>
      <div className="project-info">
        <h3 className="project-name">{project.name}</h3>
        <p className="project-desc">{project.desc}</p>
      </div>
    </div>
  );

  return (
    <div className="carousel-wrapper">
      <button
        className="carousel-arrow carousel-arrow-left"
        onClick={goPrev}
        aria-label="Projeto anterior"
        disabled={isAnimating}
      >
        <LuChevronLeft size={28} />
      </button>

      <div className="carousel-viewport" ref={viewportRef}>
        {/* Outgoing slide (current) */}
        <div
          className={`carousel-slide carousel-current ${direction ? `carousel-out-${direction}` : ''}`}
          key={`current-${currentIndex}`}
          ref={currentSlideRef}
        >
          {renderCard(currentProject)}
        </div>

        {/* Incoming slide (next) — rendered on top with clip-path reveal */}
        {incomingProject && (
          <div
            className={`carousel-slide carousel-incoming carousel-in-${direction}`}
            key={`incoming-${nextIndex}`}
            ref={incomingSlideRef}
          >
            {renderCard(incomingProject)}
          </div>
        )}
      </div>

      <button
        className="carousel-arrow carousel-arrow-right"
        onClick={goNext}
        aria-label="Próximo projeto"
        disabled={isAnimating}
      >
        <LuChevronRight size={28} />
      </button>

      <div className="carousel-dots">
        {projects.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === currentIndex && !isAnimating ? 'active' : ''} ${i === nextIndex ? 'active incoming' : ''}`}
            onClick={() => goTo(i, i > currentIndex ? 'next' : 'prev')}
            aria-label={`Projeto ${i + 1}`}
            aria-current={i === currentIndex ? 'true' : undefined}
          />
        ))}
        <span className="carousel-counter">{(nextIndex ?? currentIndex) + 1} / {total}</span>
      </div>
    </div>
  );
};

export default ProjectCarousel;
