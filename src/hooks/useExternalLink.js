import { isInAppBrowser } from '../lib/browser.js';
import { openExternalLink } from '../lib/navigation.js';

/**
 * Retorna props prontos para serem spread em um elemento <a>.
 *
 * A estratégia de retornar props diferentes por ambiente (em vez de um onClick
 * que decide internamente) é intencional:
 *
 * Em browsers padrão, o onClick não é registrado de forma alguma.
 * Isso garante que a âncora funciona 100% nativamente — sem JavaScript
 * no critical path, sem risco de double-navigation, e com comportamento
 * idêntico ao que o usuário espera de um link normal.
 *
 * Em in-app browsers, o onClick intercepta e delega para openExternalLink,
 * que usa location.assign com delay para contornar as limitações do WebView.
 *
 * @param {string} href - URL de destino
 * @returns {Object} Props para spread em <a>
 */
const useExternalLink = (href) => {
  // Avaliado uma vez por render — não precisa de useCallback aqui porque
  // isInAppBrowser() é barato e o resultado é estável durante a sessão
  const inApp = isInAppBrowser();

  const baseProps = {
    href,
    target: '_blank',
    rel: 'noopener noreferrer',
  };

  if (!inApp) {
    // Browser padrão: retorna apenas props de âncora.
    // Sem onClick = zero interceptação JS = comportamento nativo preservado.
    return baseProps;
  }

  // In-app browser: registra handler que controla a navegação diretamente
  return {
    ...baseProps,
    onClick: (e) => openExternalLink(e, href),
  };
};

export default useExternalLink;
