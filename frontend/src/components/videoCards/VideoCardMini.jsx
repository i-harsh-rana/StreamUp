import React from 'react'

function VideoCardMini({
    thumbnail = "",
    title = "",
    duration = "",
    views = "",
    ownerUsername = "",
    ownerAvatar = "",

}) {

    function secondsToHHMMSS(seconds) {
        if (typeof seconds !== 'number' || seconds < 0) {
          throw new Error('Input must be a non-negative number');
        }
      
        const roundedSeconds = Math.floor(seconds);
      
        const hours = Math.floor(roundedSeconds / 3600);
        const minutes = Math.floor((roundedSeconds % 3600) / 60);
        const secs = roundedSeconds % 60;
      
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = secs.toString().padStart(2, '0');
      
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
      }
 
    const durationStr = secondsToHHMMSS(duration);
  return (
    <div className='w-full rounded-2xl bg-white/5 h-40 grid grid-cols-5 relative'>
        <img src={thumbnail} className='h-40 w-full object-cover rounded-l-2xl col-span-2 relative' />
        <div className='p-4 grid grid-rows-3'>
            <p className='text-xl font-medium'>{title}</p>
            <div className='flex'>
                <img src={ownerAvatar} className='rounded-full w-5 h-5' />
                <p className='opacity-70 ml-2'>{ownerUsername}</p>
            </div>
            <div className='opacity-70'>{views}&nbsp;views</div>
        </div>
        <div className='p-2 rounded-lg bg-black/40 absolute bottom-4 left-40'>{durationStr}</div>
    </div>
  )
}

export default VideoCardMini