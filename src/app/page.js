import Script from "next/script";
export default function Home() {

  return (
    <div>
      <Script src="https://web-broadcast.live-video.net/1.6.0/amazon-ivs-web-broadcast.js"></Script>
      Hello world
    </div>
  );
}