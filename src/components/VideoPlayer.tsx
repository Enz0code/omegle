import React, { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  stream: MediaStream | null;
  muted?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ stream, muted = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={muted}
      className="w-full h-full object-cover"
    />
  );
};

export default VideoPlayer;