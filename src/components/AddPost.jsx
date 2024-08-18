import { Button, Grid, Input } from "@mui/material";
import { Box, useTheme } from "@mui/system";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost, getResponseForGivenPrompt } from "../api";
import { getPosts } from "../redux/postSlice";
import logo from "../logo.png";
import { AddToPhotos, CloseRounded } from "@mui/icons-material";
import { defaultProfile } from "../utils/constants";
import Modal from "./Modal";
import CToast from "../utils/components/Toast";
import { parseStyledText } from "../utils/text_parser";

const FileUploadComponent = ({ handleFileChange }) => {
  const theme = useTheme();

  return (
    <div>
      <label htmlFor="file-upload">
        <AddToPhotos
          sx={{
            color: "#777",
            borderRadius: "50%",
            padding: "6px",
            cursor: "pointer",
            "&:hover": {
              color: theme.palette.primary.dark,
              background: "#eee",
            },
          }}
        />
      </label>
      <input
        id="file-upload"
        type="file"
        onChange={handleFileChange}
        style={{ display: "none" }} // Hide the native file input element
      />
    </div>
  );
};

export default function AddPost() {
  const dispatch = useDispatch();
  const [file, setFile] = useState([]);
  const [previewUrl, setPreviewUrl] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;

    Array.from(selectedFiles).forEach((file) => {
      // Update file state with the selected file
      setFile((prevFiles) => [...prevFiles, file]);

      // Create a FileReader instance
      const reader = new FileReader();

      // Read file contents and set preview URL
      reader.onload = () => {
        setPreviewUrl((prev) => [...prev, reader.result]);
      };

      // Start reading the file as a data URL
      reader.readAsDataURL(file);
    });
  };

  const theme = useTheme();
  const [postText, setPostText] = useState("");
  const [aiPromptText, setAiPromptText] = useState("");
  const { profile, status } = useSelector((state) => state.auth);
  const user = localStorage.getItem("login");
  const _id = user !== null ? JSON.parse(user)._id : null;
  const handleAddPost = async () => {
    const formData = new FormData();
    for (let i = 0; i < file.length; i++) {
      formData.append("files", file[i]);
    }
    formData.append("description", postText);
    formData.append("createdBy", _id);
    const data = await addPost(formData);
    if (data) {
      dispatch(getPosts());
      setPostText("");
      setFile([]);
      setPreviewUrl([]);
    }
  };

  const handleGenerateAiResponse = async () => {
    if (aiPromptText.trimStart().length === 0) {
      CToast.error("Please enter a prompt to generate response");
      return;
    }
    const response = await getResponseForGivenPrompt(aiPromptText);
    if (response !== null) {
      setPostText(response);
      handleModalClose();
    } else {
      CToast.error("Something went wrong");
    }
  };
  return (
    <Box
      borderRadius={"0 0 10px 10px"}
      boxShadow={
        "0px 1px 1px rgba(0, 0, 0, 0.05), 0px 1px 1px rgba(0, 0, 0, 0.05)"
      }
      bgcolor={"#fff"}
      padding="1rem 1rem 0 1rem"
    >
      <Grid container>
        <Grid item sx={{ paddingRight: "1rem" }}>
          <img
            src={profile?.url?.image ?? defaultProfile}
            alt="lgogo"
            width="50px"
          />
        </Grid>
        <Grid item flexGrow="1">
          <Box>
            <Input
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              multiline
              // rows="2"

              maxRows={12}
              hidden={true}
              disableUnderline
              type="text"
              placeholder="What's happening?"
              sx={{
                width: "100%",
                background: "#eff0f4",
                borderRadius: "12px",
                padding: "12px",
              }}
            >
              {parseStyledText(postText)}
            </Input>
          </Box>
          {previewUrl.length > 0 && (
            <div>
              {previewUrl.map((url, index) => (
                <Box
                  position="relative"
                  key={index}
                  display="inline-block"
                  marginRight="10px"
                  marginBottom="10px"
                >
                  <Box
                    component={"img"}
                    src={url}
                    borderRadius={"10px"}
                    marginRight={"10px"}
                    alt="Selected"
                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                  />
                  <CloseRounded
                    style={{
                      zIndex: "10",
                      position: "absolute",
                      width: "20px",
                      height: "20px",
                      top: "-10px",
                      right: "0",
                      color: "white",
                      background: "black",
                      borderRadius: "50%",
                      padding: "2px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setPreviewUrl((prev) => {
                        const newPreviewUrl = [...prev];
                        newPreviewUrl.splice(index, 1);
                        return newPreviewUrl;
                      });
                      setFile((prev) => {
                        const newFiles = [...prev];
                        newFiles.splice(index, 1);
                        return newFiles;
                      });
                    }}
                  />
                </Box>
              ))}
            </div>
          )}
          <Box
            textAlign="right"
            paddingBottom=".5rem"
            paddingTop=".5rem"
            display={"flex"}
            justifyContent={"space-between"}
          >
            <Box display={"flex"} alignItems={"center"}>
              <FileUploadComponent handleFileChange={handleFileChange} />
              <Box
                sx={{
                  border: "2px solid #112A89",
                  marginLeft: "10px",
                  borderRadius: "12px",
                }}
              >
                <Button
                  onClick={handleModalOpen}
                  sx={{
                    fontSize: "14px",
                    color: "#112A89",
                    fontWeight: "600",
                    textTransform: "none",
                    padding: "6px 12px",
                  }}
                >
                  Generate With AI
                </Button>
              </Box>
            </Box>

            <Button
              onClick={handleAddPost}
              disabled={postText.trimStart().length === 0}
              variant="contained"
              color="primary"
              sx={{
                borderRadius: theme.shape.borderRadius,
                fontSize: "12px",
              }}
            >
              Post
            </Button>
          </Box>
        </Grid>
      </Grid>
      {openModal && (
        <Modal
          open={openModal}
          handleClose={handleModalClose}
          saveText={"Generate"}
          handleSave={handleGenerateAiResponse}
        >
          <Box>
            <Grid container>
              <Grid item>
                <img src={logo} alt="logo" width="60px" />
              </Grid>
              <Grid item flexGrow="1">
                <Box padding=".5rem 0">
                  <Input
                    onChange={(e) => setAiPromptText(e.target.value)}
                    value={aiPromptText}
                    multiline
                    rows="2"
                    disableUnderline
                    type="text"
                    placeholder="Enter your prompt here"
                    sx={{ width: "100%" }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      )}
    </Box>
  );
}
