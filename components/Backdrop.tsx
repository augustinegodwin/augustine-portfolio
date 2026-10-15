// Out-of-focus "camera" backdrop. Pure CSS shapes by default; if
// site.heroMedia is set it renders a blurred video/photo underneath.
const mediaCls =
  "absolute inset-0 w-full h-full object-cover [filter:blur(26px)_saturate(1.1)] [transform:scale(1.12)]";

export default function Backdrop({ media, portrait }: { media: string | null; portrait?: string }) {
  const isVideo = !!media && /\.(mp4|webm|mov)$/i.test(media);
  return (
    <div className="absolute inset-0 z-[-1] overflow-hidden" aria-hidden="true">
      <div className="absolute -inset-[4%] will-change-transform" data-bg>
        <div className="absolute inset-0 bg-[#070a09]" />
        {media && isVideo && (
          <video className={mediaCls} src={media} autoPlay muted loop playsInline />
        )}
        {media && !isVideo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className={mediaCls} src={media} alt="" />
        )}
        {!media && (
          <>
            {/* pillar */}
            <div
              className="absolute left-[20%] -top-[12%] w-[11vw] h-[82%] bg-[rgba(196,202,192,0.3)] blur-[46px] will-change-transform"
              data-blob
            />
            {/* green */}
            <div
              className="absolute -right-[12%] -top-[14%] w-[74vw] h-[70%] rounded-full bg-[color:var(--tint-a)] opacity-95 blur-[110px] will-change-transform"
              data-blob
            />
            {/* glow */}
            <div
              className="absolute left-[46%] top-[20%] w-[24vw] h-[52%] rounded-full bg-[image:radial-gradient(closest-side,rgba(190,150,120,0.55),rgba(190,150,120,0))] blur-[70px] will-change-transform"
              data-blob
            />
            {/* shirt */}
            <div
              className="absolute left-[40%] -bottom-[22%] w-[46vw] h-[48%] rounded-full bg-[#0b0d0e] blur-[60px] will-change-transform"
              data-blob
            />
            {/* floor */}
            <div
              className="absolute inset-x-0 top-[66%] h-[14%] bg-[rgba(125,138,142,0.2)] blur-[46px] will-change-transform"
              data-blob
            />
            {/* tint */}
            <div
              className="absolute right-[4%] bottom-[6%] w-[42vw] h-[34%] rounded-full bg-[color:var(--tint-b)] opacity-[0.34] blur-[110px] will-change-transform"
              data-blob
            />
            {/* out-of-focus portrait, like a camera shot of the person */}
            {portrait && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="absolute -top-[8%] left-[57%] h-full max-w-none aspect-square -translate-x-1/2 blur-[10px] opacity-90 [mask-image:radial-gradient(ellipse_60%_68%_at_50%_46%,#000_50%,transparent_100%)] mobile:left-[72%] mobile:opacity-50"
                src={portrait}
                alt=""
              />
            )}
          </>
        )}
      </div>

      {/* shade */}
      <div className="absolute inset-0 bg-[image:linear-gradient(90deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.35)_34%,rgba(0,0,0,0)_58%),linear-gradient(0deg,#000_0%,rgba(0,0,0,0.82)_14%,rgba(0,0,0,0)_42%),linear-gradient(180deg,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0)_22%)]" />
      {/* grain */}
      <div className="absolute inset-0 bg-grain opacity-[0.12] mix-blend-overlay pointer-events-none" />
    </div>
  );
}