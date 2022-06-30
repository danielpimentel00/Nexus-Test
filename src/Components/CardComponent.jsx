import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
} from "@mui/material";
import { Clear as ClearIcon } from "@mui/icons-material";

export default function CardComponent({ text }) {
  return (
    <>
      <Card
        sx={{
          width: 300,
          textAlign: "left",
        }}
      >
        <CardHeader
          title="Concept"
          action={
            <IconButton aria-label="delete">
              <ClearIcon />
            </IconButton>
          }
        />
        <CardActionArea>
          <CardContent>
            <Typography variant="body1" color="text.primary">
              {text}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}
