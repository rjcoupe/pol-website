import { useEffect } from 'react';

export function useReveal(): void {
  useEffect(() => {
    document.querySelectorAll<HTMLElement>('.hero .reveal').forEach((el, i) => {
      el.style.transitionDelay = `${i * 80}ms`;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => el.classList.add('in')),
      );
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    document
      .querySelectorAll<HTMLElement>('section:not(.hero) .reveal')
      .forEach((el, i) => {
        el.style.transitionDelay = `${Math.min(i % 3, 2) * 70}ms`;
        io.observe(el);
      });
    return () => io.disconnect();
  }, []);
}
