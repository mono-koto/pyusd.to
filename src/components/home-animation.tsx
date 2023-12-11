'use client';

import { favoriteTokenSymbols, tokenLists } from '@/config';
import { P5CanvasInstance, SketchProps } from '@p5-wrapper/react';
import dynamic from 'next/dynamic';
import { Image, Renderer } from 'p5';
import { useEffect, useRef } from 'react';

import { create } from 'zustand';

interface AnimationProps {
  filteredToken: string | undefined;
  setFilteredToken: (token: string | undefined) => void;
}

export const useAnimationProps = create<AnimationProps>((set) => ({
  filteredToken: undefined as string | undefined,
  setFilteredToken: (token: string | undefined) =>
    set({ filteredToken: token }),
}));

const logoURIs = tokenLists.mainnet
  .filter((t) => favoriteTokenSymbols.includes(t.symbol))
  .map((token) => token.logoURI);

function coin(
  p5: P5CanvasInstance<SketchProps>,
  image: Image,
  rotationSpeed: number,
  special: boolean = false
) {
  p5.push();
  p5.rotateY(p5.frameCount * rotationSpeed);

  p5.push();
  p5.rotateX(p5.HALF_PI);
  if (!special) {
    p5.fill(128, 128, 128);
  }
  p5.cylinder(25.1, 6);
  p5.pop();
  p5.push();
  p5.translate(0, 0, 3.01);
  p5.texture(image);
  p5.circle(0, 0, 50);
  p5.pop();
  p5.push();
  p5.rotateY(p5.PI);
  p5.translate(0, 0, 3.01);
  p5.texture(image);
  p5.circle(0, 0, 50);
  p5.pop();
  p5.pop();
}

const sketch = (p5: P5CanvasInstance<SketchProps>) => {
  let props: SketchProps;
  let renderer: Renderer;
  let pyusdImage: Image;
  let tokenImages: Image[];
  let orbitingTokens: OrbitingToken[];
  let scatterProgress = 0;

  interface OrbitingToken {
    logoURL: string;
    image: Image;
    rotationSpeed: number;
    orbitSpeed: number;
    zAxis: number;
    yAxis: number;
    distance: number;
    scatterTarget: number;
    scatterStatus: number;
  }

  function createOrbitingToken(logoURI: string, i: number) {
    return {
      logoURL: logoURI,
      image: p5.loadImage(logoURI),
      rotationSpeed: Math.random() / 20 + 0.01,
      orbitSpeed: Math.random() / 300 + 0.001,
      zAxis: (i * p5.TWO_PI) / logoURIs.length,
      yAxis: Math.random() * p5.TWO_PI,
      distance: Math.random() * 320 + 100,
      scatterTarget: 0.5,
      scatterStatus: 0.5,
    };
  }

  p5.updateWithProps = (p: SketchProps) => {
    props = p;
    if (orbitingTokens === undefined) {
      return;
    }
    orbitingTokens.forEach((o, i) => {
      if (o.logoURL === props.filteredToken) {
        o.scatterTarget = 1;
      } else if (props.filteredToken === undefined) {
        o.scatterTarget = 0.5;
      } else {
        o.scatterTarget = 0;
      }
    });
  };

  p5.setup = () => {
    pyusdImage = p5.loadImage('/pyusd-220-219.png');

    orbitingTokens = logoURIs.map(createOrbitingToken);
    renderer = p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL);

    const gl = (renderer as any).GL as WebGL2RenderingContext;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    pyusdImage.loadPixels();
  };

  p5.windowResized = () => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  p5.draw = () => {
    p5.background(0, 0, 0, 0);
    p5.noStroke();
    p5.normalMaterial();
    p5.push();
    p5.scale(2);
    coin(p5, pyusdImage, 0.01, true);
    p5.pop();
    p5.push();
    let found = false;
    orbitingTokens.forEach((o, i) => {
      if (props.filteredToken === o.logoURL) {
        found = true;
      }

      o.scatterStatus =
        o.scatterStatus + (o.scatterTarget - o.scatterStatus) * 0.1;
      if (o.scatterStatus < 0.01) {
        return;
      }
      p5.push();
      p5.rotateZ(p5.frameCount * 0.001 + o.zAxis);
      p5.push();
      p5.rotateY(p5.frameCount * o.orbitSpeed + o.yAxis);
      const scatterAddition = (1 - o.scatterStatus) * 100;
      p5.translate(0, 0, o.distance + scatterAddition);

      p5.scale(1 * o.scatterStatus);
      coin(p5, o.image, o.rotationSpeed, false);
      p5.pop();
      p5.pop();
    });
    p5.pop();
    if (!found && props.filteredToken) {
      orbitingTokens.push({
        ...createOrbitingToken(
          props.filteredToken as string,
          orbitingTokens.length
        ),
        scatterStatus: 0,
        scatterTarget: 1,
      });
    }
  };
};

const NextReactP5Wrapper = dynamic(
  async () => (await import('@p5-wrapper/react')).ReactP5Wrapper,
  { ssr: false }
);

export default function HomeAnimation() {
  const sketchRef = useRef(sketch);
  const animationProps = useAnimationProps();

  return (
    <NextReactP5Wrapper
      sketch={sketchRef.current}
      filteredToken={animationProps.filteredToken}
    />
  );
}
