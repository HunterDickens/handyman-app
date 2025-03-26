import React, { useState } from "react";
import { Slide } from "@mui/material";
import MobileStepper from "@mui/material/MobileStepper";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";

const SlideGallery = ({ images, height = 500, showStepper = true }) => {  // Increased default height
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => 
      prevActiveStep === images.length - 1 ? 0 : prevActiveStep + 1
    );
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => 
      prevActiveStep === 0 ? images.length - 1 : prevActiveStep - 1
    );
  };

  if (!images || images.length === 0) return null;

  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center",
      width: "100%",
      maxWidth: "1200px",  // Added max-width constraint
      mx: "auto"          // Center the gallery
    }}>
      {/* Main container with arrows and image */}
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        width: "100%",
        gap: 2            // Added gap between arrows and image
      }}>
        {/* Left Navigation Arrow */}
        <IconButton
          onClick={handleBack}
          size="large"
          sx={{ 
            flexShrink: 0, // Prevent arrow from shrinking
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </IconButton>

        {/* Image container - now takes most available space */}
        <Box
          sx={{
            position: "relative",
            height: `${height}px`,
            width: "100%",  // Takes all available width
            minWidth: 0,    // Allows proper flex shrinking
            overflow: "hidden",
            flexGrow: 1,
          }}
        >
          {images.map((img, index) => (
            <div
              key={index}
              style={{ 
                position: "absolute", 
                width: "100%", 
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Slide
                direction={activeStep > index || (activeStep === 0 && index === images.length - 1) ? 
                  "right" : "left"}
                in={activeStep === index}
                mountOnEnter
                unmountOnExit
              >
                <div style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}>
                  <img
                    src={img}
                    alt={`Slide ${index}`}
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                      width: "auto",  // Allow natural width
                      height: "auto"  // Allow natural height
                    }}
                  />
                </div>
              </Slide>
            </div>
          ))}
        </Box>

        {/* Right Navigation Arrow */}
        <IconButton
          onClick={handleNext}
          size="large"
          sx={{ 
            flexShrink: 0, // Prevent arrow from shrinking
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </IconButton>
      </Box>

      {/* Dots Indicator */}
      {showStepper && (
        <MobileStepper
          variant="dots"
          steps={images.length}
          position="static"
          activeStep={activeStep}
          sx={{
            width: "100%",
            justifyContent: "center",
            backgroundColor: "transparent",
            mt: 2,
            px: 0,
            "& .MuiMobileStepper-dot": {
              width: 10,
              height: 10,
              backgroundColor: "rgba(0, 0, 0, 0.2)",
            },
            "& .MuiMobileStepper-dotActive": {
              backgroundColor: "rgba(0, 0, 0, 0.6)",
            },
          }}
          nextButton={<span />}
          backButton={<span />}
        />
      )}
    </Box>
  );
};

export default SlideGallery;