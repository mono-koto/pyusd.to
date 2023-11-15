import "../styles/coins.scss";
import pyusd from "../assets/img/pyusd.svg";

interface CoinProps {
  logoUrl?: string;
}

export default ({ logoUrl }: CoinProps) => {
  const otherToken = logoUrl || pyusd;

  return (
    <div className="inline-block scale-[0.2]">
      <div className="container">
        <div className="coin dollar">
          <div className="face front">
            <img src={pyusd} className="h-full w-full" />
          </div>
          <div className="face back overflow-hidden rounded-full">
            <img src={otherToken} className="h-full w-full" />
          </div>
          {Array(20)
            .fill(0)
            .map((v, i) => {
              return <figure className="side" key={i}></figure>;
            })}
        </div>
      </div>
    </div>
  );
};
