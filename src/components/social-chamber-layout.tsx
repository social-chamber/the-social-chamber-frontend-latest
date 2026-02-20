import { ImageItem, VideoPlayer } from "./SocialChamberRoom"

const SocialChamberLayout = () => {
  // Use static local assets instead of backend content
  const images = [
    // CMS-driven gallery to be plugged later; keep local fallbacks
    { url: "/img/all/room_1748604997730.jpeg", type: "image" },
    { url: "/img/all/room_1750752704079.jpeg", type: "image" },
    { url: "/img/all/room_1750752839337.webp", type: "image" },
    { url: "/img/all/room_1750752868788.webp", type: "image" },
    { url: "/img/all/room_1750752919937.jpeg", type: "image" },
    { url: "/img/all/1750754017573-3c8a73a3640e1c7ca52de4ca83f9b00d1ebed7c0.jpeg", type: "image" },
    { url: "/img/all/1750754033261-9a870c22b6575077156c6b7cb9da6486215fc1b1.jpeg", type: "image" },
    { url: "/img/all/1750754046992-80d28b3a805e1b018fa6769bb46211b62921bc3b.jpeg", type: "image" },
  ]

  const videos = [
    { url: "/img/hv1.mp4", type: "video" },
    { url: "/img/hv2.mp4", type: "video" },
    { url: "/img/hv3.mp4", type: "video" },
    { url: "/img/movieRoom.mp4", type: "video" },
  ]

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-[24px] grid-flow-row-dense">
        <div className="lg:h-[285px] bg-red-500 rounded-lg col-span-1 lg:col-span-1">
          {videos[0] && <VideoPlayer data={videos[0]} />}
        </div>
        <div className="lg:h-[285px] bg-blue-500 rounded-lg col-span-1 lg:col-span-2 ">
          {images[0] && <ImageItem data={images[0]} index={1} />}
        </div>
        <div className="lg:h-[285px] bg-green-500 rounded-lg col-span-1 lg:col-span-1">
          {videos[1] && <VideoPlayer data={videos[1]} />}
        </div>
        <div className="lg:h-[285px] bg-yellow-500 rounded-lg col-span-1 lg:col-span-2">
          {images[1] && <ImageItem data={images[1]} index={1} />}
        </div>
        <div className="lg:h-[285px] bg-purple-500 rounded-lg col-span-1 lg:col-span-2">
          {images[2] && <ImageItem data={images[2]} index={2} />}
        </div>
        <div className="lg:h-[285px] bg-pink-500 rounded-lg col-span-1 lg:col-span-1">
          {videos[2] && <VideoPlayer data={videos[2]} />}
        </div>
        <div className="lg:h-[285px] bg-indigo-500 rounded-lg col-span-1 lg:col-span-2">
          {images[3] && <ImageItem data={images[3]} index={3} />}
        </div>
        <div className="lg:h-[285px] bg-teal-500 rounded-lg col-span-1 lg:col-span-1">
          {videos[3] && <VideoPlayer data={videos[3]} />}
        </div>
        {/*<div className="lg:h-[285px] bg-orange-500 rounded-lg col-span-1 lg:col-span-1">
          {videos[4] && <VideoPlayer data={videos[4]} />}
        </div>
        <div className="lg:h-[285px] bg-lime-500 rounded-lg col-span-1 lg:col-span-2">
          {images[4] && <ImageItem data={images[4]} index={4} />}
        </div>
         <div className="lg:h-[285px] bg-emerald-500 rounded-lg col-span-1 lg:col-span-1">
          {videos[5] && <VideoPlayer data={videos[5]} />}
        </div>
        <div className="lg:h-[285px] bg-cyan-500 rounded-lg col-span-1 lg:col-span-2">
          {images[5] && <ImageItem data={images[5]} index={5} />}
        </div>
        <div className="lg:h-[285px] bg-red-500 rounded-lg col-span-1 lg:col-span-2">
          {images[6] && <ImageItem data={images[6]} index={6} />}
        </div>
        <div className="lg:h-[285px] bg-blue-500 rounded-lg col-span-1 lg:col-span-1">
          {videos[6] && <VideoPlayer data={videos[6]} />}
        </div>
        <div className="lg:h-[285px] bg-green-500 rounded-lg col-span-1 lg:col-span-2">
          {images[7] && <ImageItem data={images[7]} index={7} />}
        </div>
        <div className="l:h-[285px] bg-yellow-500 rounded-lg col-span-1 lg:col-span-1">
          {videos[7] && <VideoPlayer data={videos[7]} />}
        </div> */}
      </div>
    </div>
  )
}

export default SocialChamberLayout
