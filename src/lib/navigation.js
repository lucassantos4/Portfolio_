import { isInAppBrowser, isInstagram } from './browser.js';

/**
 * Timestamp do último clique navegado com sucesso.
 * Proteção simples contra double-click sem dependências externas.
 */
let lastClickAt = 0;
const DEBOUNCE_MS = 600;

/**
 * Normaliza URLs do LinkedIn para garantir navegação web em vez de deep link nativo.
 *
 * O deep link "linkedin://" não funciona em WebViews sem o app instalado e causa
 * erros silenciosos em alguns browsers. Forçamos sempre https://www.linkedin.com.
 *
 * O parâmetro `?trk=portfolio` é intencionalmente não adicionado aqui — URLSearchParams
 * poderia ser bloqueado por alguns firewalls corporativos. Mantemos a URL limpa.
 */
export const normalizeLinkedInUrl = (url) => {
  try {
    if (url.startsWith('linkedin://')) {
      return url.replace('linkedin://', 'https://www.linkedin.com/');
    }

    const parsed = new URL(url);

    // Garante protocolo seguro
    parsed.protocol = 'https:';

    // Garante que é um domínio LinkedIn legítimo
    if (!parsed.hostname.endsWith('linkedin.com')) {
      return url;
    }

    // Remove hash fragments que podem causar redirects inesperados em WebViews
    // mas preserva pathname e search (ex: /in/username/)
    return `${parsed.origin}${parsed.pathname}${parsed.search}`;
  } catch {
    return url;
  }
};

/**
 * Normaliza e valida uma URL externa antes de navegar.
 *
 * - mailto: retorna null (browser lida melhor nativamente)
 * - javascript:/data:/vbscript: retorna null (bloqueio de segurança)
 * - linkedin.com: passa por normalizeLinkedInUrl
 * - demais URLs http/https: força https
 *
 * @param {string} url
 * @returns {string|null} URL normalizada ou null para não interceptar
 */
const normalizeUrl = (url) => {
  if (!url || typeof url !== 'string') return null;

  // mailto nunca é interceptado — o OS/browser lida melhor do que nós
  if (url.startsWith('mailto:')) return null;

  // Bloqueia protocolos que nunca devem ser seguidos via JS
  if (/^(javascript|data|vbscript):/i.test(url)) return null;

  // LinkedIn tem tratamento especializado
  if (/linkedin\.com/i.test(url) || url.startsWith('linkedin://')) {
    return normalizeLinkedInUrl(url);
  }

  try {
    const parsed = new URL(url);

    // Só lida com http/https — não com blob:, file:, etc.
    if (!['http:', 'https:'].includes(parsed.protocol)) return null;

    parsed.protocol = 'https:';
    return `${parsed.origin}${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    // URL relativa ou inválida — não tenta corrigir
    return url;
  }
};

/**
 * Handler centralizado para abrir links externos de forma segura.
 *
 * Regra fundamental:
 * - Em browsers padrão: retorna false sem chamar preventDefault().
 *   A âncora HTML funciona nativamente — zero JavaScript no critical path.
 *   Isso evita o bug clássico onde o onClick intercepta o link, chama window.open,
 *   e a aba atual TAMBÉM navega para o mesmo destino.
 *
 * - Em in-app browsers (Instagram, Facebook, WebViews): intercepta o clique,
 *   chama preventDefault() e usa window.location.assign com um pequeno delay.
 *   Isso é necessário porque target="_blank" em WebViews frequentemente:
 *   a) não abre nova aba
 *   b) abre nova aba E navega a aba atual também
 *   c) é bloqueado silenciosamente pelo contexto de segurança do WebView
 *
 * @param {React.SyntheticEvent} e - Evento de clique
 * @param {string} rawUrl - URL de destino (será normalizada internamente)
 * @returns {boolean} true se o clique foi interceptado, false se deixado para o browser
 */
export const openExternalLink = (e, rawUrl) => {
  // Debounce: absorve cliques duplos acidentais ou tap repeat em mobile
  const now = Date.now();
  if (now - lastClickAt < DEBOUNCE_MS) {
    e.preventDefault();
    return true;
  }
  lastClickAt = now;

  // Em browser padrão não interceptamos — preserva comportamento nativo de <a>
  if (!isInAppBrowser()) return false;

  const url = normalizeUrl(rawUrl);

  // null = URL que não deve ser interceptada (mailto, inválida, etc.)
  if (url === null) return false;

  e.preventDefault();

  /**
   * O Instagram WebView em particular bloqueia navegação imediata
   * dentro de handlers de eventos de toque no LinkedIn.
   * O delay de 100ms dá ao WebView tempo para encerrar o ciclo do evento
   * antes de disparar a navegação.
   *
   * Para outros in-app browsers e URLs, 50ms é suficiente.
   */
  const delay = isInstagram() && /linkedin\.com/i.test(url) ? 100 : 50;

  setTimeout(() => {
    window.location.assign(url);
  }, delay);

  return true;
};
