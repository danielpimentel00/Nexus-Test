import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";

export default function CardComponent({ text, onButtonClick, onCardClick }) {
  return (
    <>
      <Card
        sx={{
          width: 300,
          textAlign: "left",
          bgcolor: "#90e0ef",
          color: "#000",
        }}
      >
        <CardActionArea
          sx={{
            height: "150px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
          onClick={onCardClick}
        >
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              sx={{ borderBottom: "3px solid #00b4d8", width: "265px" }}
            >
              Concept
            </Typography>
            <Typography paragraph variant="body1">
              {text}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions sx={{ bgcolor: "#00b4d8", position: "relative", top: 0 }}>
          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={onButtonClick}
            sx={{ left: 200 }}
          >
            Delete
          </Button>
        </CardActions>
      </Card>
    </>
  );
}
