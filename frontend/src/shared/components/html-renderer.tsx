import DOMPurify from 'dompurify';
interface HtmlRendererProps {
  html: string;
}

export function HtmlRenderer({ html }: HtmlRendererProps) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_ATTR: ['src', 'alt', 'width', 'height', 'href', 'class'],
  });

  return (
    <div
      className="tiptap-content max-h-full"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
