import { useEffect, useState } from "react";
import axios from "axios";

const Isoft = () => {
  const [videoUrl, setVideoUrl] = useState<string>("");

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_Basic_Api}/api/guide/video-link`
        );
        setVideoUrl(res.data.video_link);
      } catch (error) {
        console.error("ভিডিও লিংক আনতে সমস্যা হয়েছে:", error);
      }
    };

    fetchVideoUrl();
  }, []);

  // YouTube embed URL তৈরি
  const getEmbedUrl = (url: string) => {
    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;
    const match = url.match(youtubeRegex);
    const videoId = match?.[1];
    // Corrected YouTube embed URL format
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white p-4">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-6 space-y-6 text-center">
        <h1 className="text-4xl font-extrabold text-indigo-600">iSOFT Tech</h1>
        <p className="text-gray-700 text-lg">
          আপনার যে কোন সমস্যা আমাদের প্রতিনিধি এর সাথে যোগাযোগ করুন।
        </p>

        <div className="bg-indigo-50 p-4 rounded-lg shadow flex flex-col items-center space-y-1">
          <span className="text-sm text-gray-600">Whatsapp</span>
          <a
            href="https://wa.me/8801332331964"
            className="text-xl font-bold text-green-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            📞 01332331964
          </a>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            সফটওয়্যার কিভাবে ব্যবহার করবেন?
          </h2>
          <p className="text-gray-600 mb-4">নিচের ভিডিওটি দেখুন:</p>

          {videoUrl ? (
            <div className="relative w-full h-0 pb-[56.25%] overflow-hidden rounded-xl shadow">
              <iframe
                src={getEmbedUrl(videoUrl)}
                title="Software Guide Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              ></iframe>
            </div>
          ) : (
            <p className="text-sm text-gray-500">ভিডিও লোড হচ্ছে...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Isoft;
