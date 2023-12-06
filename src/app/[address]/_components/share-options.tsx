'use client';

import {
  FacebookIcon,
  FacebookShareButton,
  GabIcon,
  GabShareButton,
  LineIcon,
  LineShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  WeiboIcon,
  WeiboShareButton,
  WhatsappIcon,
  WhatsappShareButton,
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
