'use client';

import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { should } from 'vitest';

interface LogoProps extends React.SVGAttributes<SVGElement> {
  animate?: boolean;
  dynamicHover?: boolean;
}

const Logo: React.FC<LogoProps> = (props) => {
  const [mouseOver, setMouseOver] = useState<boolean>(false);
  const [cc, setCc] = useState(false);

  const shouldAnimate = props.animate || (props.dynamicHover && mouseOver);
  const animationProps = shouldAnimate
    ? {
        strokeWidth: '12',

        strokeDashoffset: '0',
        strokeDasharray: '0 24',
      }
    : {};

  const svgProps = { ...props };
  delete svgProps.dynamicHover;
  delete svgProps.animate;

  return (
    <svg
      onMouseOver={() => {
        setMouseOver(true);
        setCc(!cc);
      }}
      onMouseOut={() => setMouseOver(false)}
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...svgProps}
    >
      <path
        // className={cn(shouldAnimate && 'pulse-stroke')}
        d="M108.333 159.333L100 167.667L37.5 105.767C33.3776 101.755 30.1304 96.9335 27.9629 91.6053C25.7954 86.2771 24.7547 80.5579 24.9061 74.8078C25.0576 69.0576 26.398 63.4011 28.843 58.1945C31.2879 52.9878 34.7845 48.3438 39.1124 44.5548C43.4403 40.7659 48.5059 37.9141 53.9901 36.179C59.4743 34.4439 65.2584 33.8632 70.9781 34.4733C76.6978 35.0835 82.2292 36.8713 87.224 39.7242C92.2188 42.5771 96.5687 46.4333 100 51.05C105.879 43.2295 114.322 37.727 123.85 35.5066C133.378 33.2863 143.384 34.4896 152.114 38.9059C160.844 43.3221 167.742 50.6696 171.599 59.661C175.456 68.6523 176.025 78.7141 173.208 88.0833"
        stroke="#CE007C"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...animationProps}
      >
        {shouldAnimate && (
          <>
            <animate
              attributeName="stroke-dashoffset"
              values={cc ? '0;24' : '0;-24'}
              dur="0.2s"
              repeatCount="indefinite"
            />
          </>
        )}
      </path>
      <path
        d="M155.326 91.988H148.285H132.765C130.267 91.988 128.071 93.805 127.693 96.3035L126.103 106.524V106.6H118.532C116.488 106.6 114.898 108.266 114.898 110.234C114.898 112.278 116.563 113.868 118.532 113.944H124.967L123.831 120.985L123.756 121.514H116.185C114.141 121.514 112.551 123.18 112.551 125.149C112.551 127.117 114.216 128.783 116.185 128.783H122.62L119.137 150.814L118.002 158.158L117.396 162.095C116.942 165.199 119.289 168 122.469 168H127.314H133.976H139.428C141.926 168 144.046 166.183 144.5 163.685L147.756 143.47H149.648H155.705C170.014 143.47 181.673 131.66 181.446 117.275C181.219 103.117 169.408 91.988 155.326 91.988ZM132.387 113.944L155.251 114.019C157.295 114.019 159.036 115.685 159.036 117.805C159.036 119.849 157.37 121.59 155.251 121.59H131.175L132.387 113.944ZM155.402 136.051H151.541H149.724H145.863C143.364 136.051 141.244 137.868 140.79 140.366L137.535 160.656H125.118L130.04 128.858H155.251C161.383 128.858 166.304 123.861 166.304 117.805C166.304 111.748 161.307 106.751 155.251 106.751L133.598 106.676L134.734 99.4074H155.781C166.077 99.4074 174.405 107.887 174.178 118.183C173.875 128.177 165.471 136.051 155.402 136.051Z"
        fill="#1648C9"
      />
    </svg>
  );
};
export default Logo;
