// A normal HTML image replaces the framework-specific image component from Lovable.
export default function Image({ src, alt, width, height, className, style, ...props }) {
  return <img src={src} alt={alt} width={width} height={height} className={className} style={style} {...props} />;
}
