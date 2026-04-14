import useExternalLink from '../hooks/useExternalLink.js';

/**
 * Substituto seguro de <a target="_blank"> para links externos.
 *
 * Uso:
 *   <ExternalLink href="https://github.com/lucasnsnt/" className="contact-item">
 *     GitHub
 *   </ExternalLink>
 *
 * O componente é intencionalmente thin — não contém lógica própria.
 * Toda a inteligência de navegação fica em useExternalLink + navigation.js,
 * separando responsabilidades e facilitando testes unitários futuros.
 *
 * Props adicionais (className, aria-*, role, tabIndex, etc.) são
 * passadas diretamente para o <a> via rest spread.
 */
const ExternalLink = ({ href, children, className, ...rest }) => {
  const linkProps = useExternalLink(href);

  return (
    <a {...linkProps} className={className} {...rest}>
      {children}
    </a>
  );
};

export default ExternalLink;
