import React, { useRef, useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import './videoPlayerStyle.css'; // Ensure this is correctly imported

const VideoPlayer = ({ src, poster }) => {
  const videoRef = useRef(null);
  let player;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (videoRef.current) {
  
        player = videojs(videoRef.current, {
          controls: true,
          autoplay: false,
          preload: 'auto',
          responsive: false,
          fluid: false,
          poster: poster,
          sources: [
            {
              src: src,
              type: 'video/mp4',
            },
          ],
        });
  
  
        return () => {
          if (player) {
            player.dispose();
          }
        };
      } else {
        console.error('videoRef.current is null or undefined');
      }
    }, 100); 
  
    return () => clearTimeout(timer);
  }, [src, poster]);
  
  
  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );
};

export default VideoPlayer;
