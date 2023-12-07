'use client';

import { usePreferredTokens, useTokens } from '@/hooks/useTokens';
import { shuffle } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { P5CanvasInstance, Sketch, SketchProps } from '@p5-wrapper/react';
import { Image, Renderer } from 'p5';
import { useCallback } from 'react';

const NextReactP5Wrapper = dynamic(
  async () => (await import('@p5-wrapper/react')).ReactP5Wrapper
  // { ssr: false }
);
export default async function HomeAnimation() {
  const preferredTokens = usePreferredTokens()
    .filter((token) => token.symbol !== 'PYUSD')
    .map((token) => token.logoURI);
  const allTokens = shuffle(
    useTokens()
      .filter(
        (token) => token.logoURI.endsWith('.png') && token.symbol !== 'PYUSD'
      )
      .map((token) => token.logoURI)
  ).slice(0, 15);
  const tokenSet = new Set([...preferredTokens, ...allTokens, '/icon.png']);
  const tokens = [...tokenSet];

  const sketch: Sketch = useCallback(
    (p5) => {
      let renderer: Renderer;
      let pyusdImage: Image;
      let tokenImages: Image[];
      let orbitingTokens: OrbitingToken[];

      interface OrbitingToken {
        image: Image;
        rotationSpeed: number;
        orbitSpeed: number;
        zAxis: number;
        yAxis: number;
        distance: number;
      }

      p5.preload = () => {
        pyusdImage = p5.loadImage('/pyusd-220-219.png');
        tokenImages = tokens.map((logoURI) => p5.loadImage(logoURI));
      };

      p5.setup = () => {
        orbitingTokens = tokens.map((token, i) => ({
          image: tokenImages[i],
          rotationSpeed: Math.random() / 20 + 0.01,
          orbitSpeed: Math.random() / 300 + 0.001,
          zAxis: (i * p5.TWO_PI) / tokens.length,
          yAxis: Math.random() * p5.TWO_PI,
          distance: Math.random() * 400 + 100,
        }));
        renderer = p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL);
        console.log(
          renderer as any,
          (renderer as any).renderer,
          (renderer as any).GL
        );

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
        // p5.translate(0, -p5.windowHeight / 2);

        // const offsetX = p5.mouseX - p5.windowWidth / 2;
        // const offsetY = p5.mouseY - p5.windowHeight / 2;
        // p5.translate(-offsetX / 10, -offsetY / 10);
        p5.push();

        p5.scale(2);
        coin(p5, pyusdImage, 0.01, true);
        p5.pop();
        p5.push();
        orbitingTokens.forEach((o, i) => {
          p5.push();
          p5.rotateZ(p5.frameCount * 0.001 + o.zAxis);
          p5.push();
          p5.rotateY(p5.frameCount * o.orbitSpeed + o.yAxis);
          p5.translate(0, 0, o.distance);
          p5.scale(0.5);
          coin(p5, o.image, o.rotationSpeed, false);
          p5.pop();
          p5.pop();
        });
        p5.pop();
      };

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
    },
    [tokens]
  );

  return (
    <NextReactP5Wrapper
      className="absolute h-screen w-screen"
      sketch={sketch}
      tokens={tokens}
    />
  );
}
