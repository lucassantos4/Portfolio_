/**
 * Utilitários de detecção de ambiente de browser.
 *
 * Todas as funções são defensivas: funcionam mesmo sem `navigator`
 * (ex: SSR futuro, ambientes de teste sem window).
 */

const getUA = () =>
  typeof navigator !== 'undefined' ? navigator.userAgent : '';

/** Retorna true dentro do Instagram In-App Browser */
export const isInstagram = () => /Instagram/i.test(getUA());

/**
 * Retorna true dentro do Facebook In-App Browser.
 * FBAN = Facebook App Native, FBAV = Facebook App Version, FB_IAB = FB In-App Browser.
 */
export const isFacebook = () => /FBAN|FBAV|FB_IAB/i.test(getUA());

/** Retorna true dentro do Twitter/X In-App Browser */
export const isTwitter = () => /Twitter/i.test(getUA());

/** Retorna true dentro do TikTok In-App Browser */
export const isTikTok = () => /musical_ly|TikTok/i.test(getUA());

/**
 * Retorna true para WebViews genéricos não identificados por app específico.
 *
 * Android: o token "wv" é adicionado ao UA por WebViews modernos.
 * iOS: Safari real sempre inclui "Safari/xxx.x" no UA — WebViews não incluem.
 * Isso distingue WKWebView de Safari nativo de forma confiável.
 */
export const isGenericWebView = () => {
  const ua = getUA();

  // Android WebView explícito (Chrome WebView adiciona "; wv)")
  if (/\bwv\b/.test(ua) && /Android/.test(ua)) return true;

  // iOS WebView: tem AppleWebKit mas não tem o token "Safari/" no final
  if (/iP(hone|od|ad)/.test(ua) && /AppleWebKit/.test(ua) && !/Safari\//.test(ua)) return true;

  return false;
};

/**
 * Retorna true se o ambiente for qualquer in-app browser ou WebView conhecidos.
 * Use esta função como guard principal antes de interceptar links.
 */
export const isInAppBrowser = () =>
  isInstagram() ||
  isFacebook() ||
  isTwitter() ||
  isTikTok() ||
  isGenericWebView();

/** Retorna true apenas em browsers standalone padrão (Chrome, Firefox, Safari, Edge). */
export const isStandardBrowser = () => !isInAppBrowser();
