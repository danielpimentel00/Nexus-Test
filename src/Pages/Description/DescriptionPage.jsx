import React from "react";
import { useParams } from "react-router-dom";

export default function DescriptionPage() {
  const param = useParams();
  return <div>DescriptionPage id:{param.id}</div>;
}
