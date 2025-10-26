export default function Iframe({ src, title }: { src: string; title: string }) {
  return (
    <iframe
      src={src}
      width="100%"
      className="compornents-iframe compornents-iframe-story"
      title={title}
    />
  );
}
