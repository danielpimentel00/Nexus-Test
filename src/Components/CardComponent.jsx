import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";

export default function CardComponent({ text, onButtonClick }) {
  return (
    <>
      <Card
        sx={{
          width: 300,
          textAlign: "left",
          bgcolor: "#FFFFE0",
        }}
      >
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h5">
              Concept
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {text}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions sx={{ bgcolor: "#FFFACD" }}>
          <Button
            variant="outlined"
            size="small"
            color="error"
            disableElevation
            onClick={onButtonClick}
            sx={{ position: "relative", left: 200 }}
          >
            Delete
          </Button>
        </CardActions>
      </Card>
    </>
  );
}
