import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const XGraphicsDisplay = ({ imageArr }: { imageArr: string[] }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Default for small screens
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024, // Screens larger than 1024px
        settings: {
          slidesToShow: 3, // Show 3 images
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768, // Screens between 768px and 1024px
        settings: {
          slidesToShow: 2, // Show 2 images
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 480, // Screens smaller than 480px
        settings: {
          slidesToShow: 1, // Show 1 image
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
    ],
  };

  return (
    <div style={{ width: "100%", margin: "auto" }}>
      <Slider {...settings}>
        {imageArr.map((image, index) => (
          <div
            key={index}
            style={{ width: "100%", height: "300px", overflow: "hidden" }}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default XGraphicsDisplay;
