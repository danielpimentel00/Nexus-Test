import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import transactionsService from "../../Services/TransactionsService";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  Alert,
  Collapse,
} from "@mui/material";

export default function DescriptionPage() {
  const [transaction, setTransaction] = useState({});

  const param = useParams();

  useEffect(() => {
    getTransaction(param.id);
  }, []);

  const getTransaction = (id) => {
    transactionsService
      .getTransactionById(id)
      .then((res) => {
        setTransaction(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="DescriptionPage">
      <div>
        <TextField
          margin="dense"
          name="concept"
          type="text"
          fullWidth
          variant="standard"
          helperText="Concept"
          value={transaction.concept}
          // onChange={(e) => handleInputChange(e)}
        />
        {transaction.description !== "" && (
          <TextField
            margin="dense"
            name="description"
            type="text"
            fullWidth
            variant="standard"
            helperText="Description"
            multiline
            value={transaction.description}
            // onChange={(e) => handleInputChange(e)}
          />
        )}

        <TextField
          margin="dense"
          name="ammount"
          helperText="Ammount"
          type="number"
          fullWidth
          variant="standard"
          value={transaction.ammount}
          // onChange={(e) => handleInputChange(e)}
        />
        <TextField
          margin="dense"
          name="date"
          helperText="Date"
          type="text"
          fullWidth
          variant="standard"
          value={transaction.date}
          // onChange={(e) => handleInputChange(e)}
        />
      </div>
    </div>
  );
}
