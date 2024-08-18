import { Box, Typography } from "@mui/material";
import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";

const RelatedProductsSlider = ({ products }) => {
  return (
    <Box padding="1rem">
      <Typography sx={{ fontSize: "16px", fontWeight: 500 }}>
        Related Products
      </Typography>
      <Swiper
        spaceBetween={10}
        slidesPerView={3}
        autoplay={{ delay: 3000 }}
        loop
        pagination={{ clickable: true }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <a href={product.product_url} target="_blank">
              <Box
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "1rem",
                  textAlign: "center",
                }}
              >
                <img
                  src={product.image[0]}
                  alt="product"
                  width="150px"
                  height="200px"
                  style={{ borderRadius: "10px" }}
                />
                <Typography
                  variant="text"
                  sx={{
                    fontSize: "14px",
                    fontWeight: 500,
                    textAlign: "start",
                    color: "#333",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    display: "-webkit-box",
                  }}
                >
                  {product.product_name}
                </Typography>
                <Box
                  display={"flex"}
                  justifyContent={"start"}
                  marginTop={"10px"}
                  alignItems={"baseline"}
                >
                  <Typography
                    sx={{
                      fontSize: "16px",
                      color: "#555",
                      textDecorationLine: "line-through",
                    }}
                  >
                    ₹{product.retail_price}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "22px",
                      marginLeft: "10px",
                      color: "#555",
                    }}
                  >
                    ₹{product.discounted_price}
                  </Typography>
                </Box>
              </Box>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default RelatedProductsSlider;
