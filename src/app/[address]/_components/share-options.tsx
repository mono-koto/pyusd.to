'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { QRCodeSVG } from 'qrcode.react';
import icon from '../../public/heartpyusd.svg';

import { useEffect, useState } from 'react';
import { BiQrScan } from 'react-icons/bi';

import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  FacebookShareButton,
  FacebookShareCount,
  GabIcon,
  GabShareButton,
  HatenaIcon,
  HatenaShareButton,
  HatenaShareCount,
  InstapaperIcon,
  InstapaperShareButton,
  LineIcon,
  LineShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  LivejournalIcon,
  LivejournalShareButton,
  MailruIcon,
  MailruShareButton,
  OKIcon,
  OKShareButton,
  OKShareCount,
  PinterestIcon,
  PinterestShareButton,
  PinterestShareCount,
  PocketIcon,
  PocketShareButton,
  RedditIcon,
  RedditShareButton,
  RedditShareCount,
  TelegramIcon,
  TelegramShareButton,
  TumblrIcon,
  TumblrShareButton,
  TumblrShareCount,
  TwitterShareButton,
  ViberIcon,
  ViberShareButton,
  VKIcon,
  VKShareButton,
  VKShareCount,
  WeiboIcon,
  WeiboShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  WorkplaceIcon,
  WorkplaceShareButton,
  XIcon,
} from 'react-share';

interface ShareProps {
  shareUrl: string;
  who: string;
}

const iconAttrs = {
  size: 40,
  round: true,
};

export function ShareOptions({ who, shareUrl }: ShareProps) {
  const title = `Send PYUSD to ${who} `;
  return (
    <div className="flex flex-row flex-wrap justify-center gap-3 lg:gap-6">
      <TwitterShareButton url={shareUrl} title={title}>
        <XIcon {...iconAttrs} />
      </TwitterShareButton>

      <FacebookShareButton url={shareUrl}>
        <FacebookIcon {...iconAttrs} />
      </FacebookShareButton>

      <TelegramShareButton url={shareUrl} title={title}>
        <TelegramIcon {...iconAttrs} />
      </TelegramShareButton>

      <WhatsappShareButton url={shareUrl} title={title} separator=":: ">
        <WhatsappIcon {...iconAttrs} />
      </WhatsappShareButton>

      <LinkedinShareButton url={shareUrl}>
        <LinkedinIcon {...iconAttrs} />
      </LinkedinShareButton>

      <GabShareButton url={shareUrl}>
        <GabIcon {...iconAttrs} />
      </GabShareButton>

      <LineShareButton url={shareUrl}>
        <LineIcon {...iconAttrs} />
      </LineShareButton>

      <WeiboShareButton url={shareUrl}>
        <WeiboIcon {...iconAttrs} />
      </WeiboShareButton>
    </div>
  );
}
