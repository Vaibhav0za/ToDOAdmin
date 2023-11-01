import * as React from "react";
import { Box, Modal, Fade, Button, Grid, Backdrop } from "@mui/material";
import BaseColor from "../../config/color";
import CloseIcon from "@mui/icons-material/Close";
import PropType from "prop-types";

const style = {
  position: "absolute",
  top: "30%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 3,
};

const TransitionsModal = (props) => {
  const { visible, onClose = () => {}, children, title } = props;

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={visible}
        onClose={onClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={visible}>
          <Grid sx={style} container>
            <Grid
              sx={{
                background: BaseColor.primary,
                borderTopLeftRadius: 7,
                borderTopRightRadius: 7,
                p: 1,
                color: BaseColor.white,
              }}
              justifyContent={"space-between"}
              container
            >
              <Grid>{title}</Grid>
              <Grid>
                <CloseIcon onClick={onClose} />
              </Grid>
            </Grid>
            <Box sx={{ p: 4 }}>{children}</Box>
          </Grid>
        </Fade>
      </Modal>
    </div>
  );
};

TransitionsModal.propTypes = {
  visible: PropType.bool,
  onClose: PropType.func,
};

TransitionsModal.defaultProps = {
  visible: false,
  onClose: () => {},
};
export default TransitionsModal;
