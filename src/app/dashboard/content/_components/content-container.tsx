"use client";
import React, { useState } from "react";
import ImageContainer from "./ImageContainer";
import VideoContainer from "./VideoContainer";

const ContentContainer = () => {
  const [activeTab, setActiveTab] = useState("image");

  return (
    <div>
      <div className="w-full flex items-center justify-between pt-[40px] pb-[80px] px-[40px]">
        <h2 className="text-2xl font-poppins font-semibold tracking-[0%] text-black leading-[24px]">
          Content Management
        </h2>
        <div className=" flex items-center">
          <button
            onClick={() => setActiveTab("image")}
            className={`${
              activeTab === "image"
                ? "bg-[#FF6900] text-white font-semibold"
                : "font-normal bg-white text-black"
            } font-poppins leading-[120%] tracking-[0%] py-[10.5px] px-[33.5px] rounded-l-lg`}
          >
            Image
          </button>
          <button
            onClick={() => setActiveTab("video")}
            className={`${
              activeTab === "video"
                ? "bg-[#FF6900] text-white font-semibold"
                : "font-normal bg-white text-black"
            } font-poppins leading-[120%] tracking-[0%] py-[10.5px] px-[33.5px] rounded-r-lg`}
          >
            Video
          </button>
        </div>
      </div>

      {/* Tab container  */}
      {activeTab === "image" && (
        <div>
          <ImageContainer />
        </div>
      )}
      {activeTab === "video" && (
        <div>
          <VideoContainer />
        </div>
      )}
    </div>
  );
};

export default ContentContainer;
