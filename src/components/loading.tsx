'use client';

import { LuLoader2 } from 'react-icons/lu';
import React, { useEffect, useState } from 'react';

const expressions = [
  'Reticulating Splines…',
  'Generating witty dialog…',
  'Swapping time and space…',
  'Spinning violently around the y-axis…',
  'Opening a can of worms…',
  'I’m sorry, Dave. I’m afraid I can’t do that.',
  'It is pitch black. You are likely to be eaten by a grue.',
  'Loading funny message…',
  'Help, I’m trapped in a loader!',
  'Please wait while the satellite moves into position…',
  'The bits are breeding.',
  'We’re making you a cookie.',
  'Creating time-loop inversion field…',
  'Composing a poem…',
  'Summoning unicorns…',
  'Strategizing with penguins…',
  'Shaking hands with aliens…',
  'Juggling watermelons…',
  'Assembling a team of superheroes…',
  'Revving up the quantum engine…',
  'Waking up the sleeping dragon…',
  'Playing hide and seek with ghosts…',
  'Doing the Macarena…',
  'Training hamsters for the Olympics…',
  'Building a castle from toothpicks…',
  'Painting the sky with rainbows…',
  'Searching for lost socks…',
  'Convincing gravity to take a break…',
  'Making friends with the Loch Ness Monster…',
  'Mixing potions for ultimate speed…',
  'Teaching squirrels to play chess…',
  'Inventing a language for dolphins…',
  'Catching clouds in a net…',
  'Reversing the flow of time…',
  'Giving a giraffe a piggyback ride…',
  'Bottling starlight for nighttime use…',
  'Counting grains of sand…',
  'Tears in the rain…',
  'Finding the lost city of Atlantis…',
  'Teaching ants to breakdance…',
  'Opening a portal to an alternate universe…',
  'Training dolphins as software engineers…',
  'Brewing coffee with lightning bolts…',
  'Zeroing in on the answer with laser precision…',
  'Riding a rollercoaster made of spaghetti…',
  'Mixing glitter with stardust…',
  'Designing a better mousetrap…',
  'Sailing the seas of code…',
];

const Loading: React.FC = () => {
  const expressionIndex = Math.floor(Math.random() * expressions.length);

  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-3 opacity-40 md:min-h-[200px]">
      <LuLoader2 className="h-12 w-12 animate-spin" />
      <span>{expressions[expressionIndex]}</span>
    </div>
  );
};

export default Loading;
