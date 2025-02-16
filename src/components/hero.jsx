import { useEffect, useRef, useState } from "react";
import Button from "./utilities/button";
import { ArrowRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [backVideoIndex, setBackVideoIndex] = useState(1);
  //   const [backVideoCanSwitch, setBackVideocanSwitch] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);

  const TOTALVIDEOS = 4;

  const nextVideoRef = useRef(null);
  const videoContainerRef = useRef(null);

  const upcomingVideoIndex = (currentIndex % TOTALVIDEOS) + 1;

  const handleMiniVidClick = () => {
    setHasClicked(true);
    setCurrentIndex((prev) => (prev % TOTALVIDEOS) + 1);
  };

  const handleVideoLoad = () => {
    setLoadedVideos((prev) => prev + 1);
  };

  const getVideoSrc = (index) => {
    return `/videos/hero-${index}.mp4`;
  };

  useEffect(() => {
    loadedVideos === 3 && setIsLoading(false);
  }, [loadedVideos]);

  useGSAP(
    () => {
      if (hasClicked) {
        gsap.set("#next-video", { visibility: "visible" });

        gsap.from("#current-video", {
          transformOrigin: "center center",
          scale: 0,
          display: "none",
          duration: 1.9,
          ease: "expo.Out",
        });

        gsap.to("#next-video", {
          transformOrigin: "center center",
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1.9,
          ease: "expo.out",
          onStart: () => nextVideoRef.current.play(),
          onComplete: () => {
            setBackVideoIndex((prev) => (prev % TOTALVIDEOS) + 1);
            setHasClicked(false);
          },
        });
      }
    },
    { dependencies: [currentIndex], revertOnUpdate: true }
  );

  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: " polygon(14% 0%, 72% 0%, 90% 90%, 0% 100%)",
      borderRadius: "0 0 0% 0%",
    });

    gsap.from("#video-frame", {
      clipPath: " polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0 0 0 0",
      ease: "expo.out",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">
      {isLoading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50">
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      )}
      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
      >
        <div
          onClick={handleMiniVidClick}
          ref={videoContainerRef}
          className="mask-clip-path block absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg scale-50 opacity-0 hover:opacity-100  transition-all duration-500 ease-in hover:scale-100"
        >
          <video
            ref={nextVideoRef}
            src={getVideoSrc(upcomingVideoIndex)}
            loop
            muted
            id="current-video"
            className="size-64 origin-center scale-150 object-cover object-center"
            onLoadedData={handleVideoLoad}
          />
        </div>
        <video
          src={getVideoSrc(currentIndex)}
          loop
          muted
          autoPlay
          id="next-video"
          className="absolute-center invisible z-20 size-64 object-cover object-center"
          onLoadedData={handleVideoLoad}
        />
        <video
          id="back-video"
          src={getVideoSrc(
            backVideoIndex === TOTALVIDEOS - 1 ? 1 : backVideoIndex
          )}
          loop
          muted
          autoPlay
          className="absolute left-0 top-0 size-full object-cover object-center"
          onLoadedData={handleVideoLoad}
        />
        <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
          G<b>a</b>ming
        </h1>
      </div>

      <div className="absolute left-0 top-0 z-40">
        <div className="mt-24 px-5 sm:px-10">
          <h1 className="special-font hero-heading text-blue-100">
            redefi<b>n</b>e
          </h1>
          <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
            Enter the Metagame Layer <br /> Unleash the Play Economy
          </p>
          <Button
            id="watch-trailer"
            title="Watch Trailer"
            leftIcon={<ArrowRight className="w-4" />}
            containerClass="bg-yellow-300 flex-center gap-1"
          />
        </div>
      </div>
      <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
        G<b>a</b>ming
      </h1>
    </div>
  );
};

export default Hero;
