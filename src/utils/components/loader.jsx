import { Box, Grid, Skeleton, Typography } from "@mui/material";
import React from "react";

const Cloader = () => {
  return (
    <Grid container px="30px" justifyContent="space-between" alignItems="start">
      <Grid item width="20%" marginTop="100px">
        {Array.from(new Array(6)).map((item, index) => (
          <Skeleton
            height="50px"
            width="200px"
            sx={{
              marginBottom: "30px",
            }}
          />
        ))}
      </Grid>
      <Box width="40%" height="100vh" sx={{ overflowY: "scroll" }}>
        {Array.from(new Array(3)).map((item, index) => (
          <Box key={index} sx={{ marginRight: 0.5, my: 5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <Skeleton
                variant="rectangular"
                width={50}
                height={50}
                sx={{ borderRadius: "50%", marginRight: 1 }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <Skeleton width="30%" />
                <Skeleton width="60%" />
              </Box>
            </Box>
            <Skeleton variant="rectangular" width="100%" height={318} />

            <Box sx={{ pt: 0.5 }}>
              <Skeleton />
              <Skeleton width="60%" />
            </Box>
          </Box>
        ))}
      </Box>
      <Grid item width={"25%"} marginTop="100px">
        {Array.from(new Array(6)).map((item, index) => (
          <Box
            width="100%"
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <Skeleton
              variant="rectangular"
              width={50}
              height={50}
              sx={{ borderRadius: "50%", marginRight: 1 }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Skeleton width="30%" />
              <Skeleton width="60%" />
            </Box>
          </Box>
        ))}
      </Grid>
    </Grid>
  );
};

export default Cloader;
