import { CCarousel, CCarouselItem } from "@coreui/react";
import React from "react";
// import img from '../../../images/1ordertshirt.jpeg'

export default function ImageCarousel() {
  return (
    <>
      <CCarousel>
        <CCarouselItem
          className="d-block w-100"
          src="../../../images/1ordertshirt.jpeg"
          alt="slide1"
        ></CCarouselItem>
      </CCarousel>
      <CCarousel>
        <CCarouselItem
          className="d-block w-100"
          src="../../../images/2ordertshirt.jpeg"
          alt="slide1"
        ></CCarouselItem>
      </CCarousel>
      <CCarousel>
        <CCarouselItem
          className="d-block w-100"
          src="../../../images/3ordertshirt.jpeg"
          alt="slide1"
        ></CCarouselItem>
      </CCarousel>
    </>
  );
}
