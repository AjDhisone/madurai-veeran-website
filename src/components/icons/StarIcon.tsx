interface StarIconProps {
  size: 16 | 20 | 24 | 32 | 56;
  className?: string;
  spinning?: boolean;
}

const viewBoxMap: Record<number, string> = {
  16: '0 0 16 16',
  20: '0 0 20 20',
  24: '0 0 24 24',
  32: '0 0 32 32',
  56: '0 0 56 56',
};

const pathMap: Record<number, string> = {
  16: 'M7.5 16H8.5C8.5 12 12 8.5 16 8.5V7.5C12 7.5 8.5 4 8.5 0H7.5C7.5 4 4.10221 6.93559 0 7.5V8.5C4 8.5 7.5 12 7.5 16Z',
  20: 'M9.5 20H10.5C10.5 15 15 10.5 20 10.5V9.5C15 9.5 10.5 5 10.5 0H9.5C9.5 5 5 9.5 0 9.5V10.5C5 10.5 9.5 15 9.5 20Z',
  24: 'M11.5 24H12.5C13.3461 17.847 17.8467 13.3466 24 12.5L24 11.5C17.8467 10.6534 13.3461 6.15304 12.5 0H11.5C10.6539 6.15304 6.15331 10.6534 0 11.5V12.5C6.15331 13.3466 10.6539 17.847 11.5 24Z',
  32: 'M15.5 32H16.5C16.5 23.5 23.5 16.5 32 16.5V15.5C23.5 15.5 16.5 8.5 16.5 0H15.5C15.5 8.5 8.5 15.5 0 15.5V16.5C8.5 16.5 15.5 23.5 15.5 32Z',
  56: 'M27.5 56H28.5C28.5 43 43 28.5 56 28.5V27.5C43 27.5 28.5 13 28.5 0H27.5C27.5 13 13 27.5 0 27.5V28.5C13 28.5 27.5 43 27.5 56Z',
};

export default function StarIcon({ size, className, spinning }: StarIconProps) {
  const wrapperClass = spinning ? `star_${size} spinning` : `star_${size}`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      viewBox={viewBoxMap[size]}
      fill="none"
      className={className ?? wrapperClass}
    >
      <path d={pathMap[size]} fill="currentColor" className="inner_star" />
    </svg>
  );
}
