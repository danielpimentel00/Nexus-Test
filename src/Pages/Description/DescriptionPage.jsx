import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import "./DescriptionPage.css";

export default function DescriptionPage() {
  const [originalTransaction, setOriginalTransaction] = useState({});
  const [updatedTransaction, setUpdatedTransaction] = useState({});
  const [isEditEnabled, setIsEditEnabled] = useState(false);

  const navigate = useNavigate();
  const param = useParams();

  useEffect(() => {
    getTransaction(param.id);
  }, []);

  const getTransaction = (id) => {
    transactionsService
      .getTransactionById(id)
      .then((res) => {
        const date = res.date.substring(0, res.date.indexOf("T"));
        const year = date.substring(0, 4);
        const month = date.substring(5, 7);
        const day = date.substring(8, 10);
        const dateWithFormat = `${year}-${month}-${day}`;

        setOriginalTransaction({ ...res, date: dateWithFormat });

        setUpdatedTransaction({
          ...res,
          date: dateWithFormat,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateTransaction = () => {
    if (originalTransaction.candidateId === process.env.REACT_APP_USER_ID) {
      transactionsService
        .putTransaction({
          id: updatedTransaction.id,
          concept: updatedTransaction.concept,
          description: updatedTransaction.description,
          ammount: updatedTransaction.ammount,
          date: updatedTransaction.date,
        })
        .then((res) => {
          getTransaction(param.id);
          setIsEditEnabled(false);
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setOriginalTransaction(updatedTransaction);
      setIsEditEnabled(false);
    }
  };

  const handleInputChange = (event) => {
    let tempTransaction = { ...updatedTransaction };
    const eventName = event.target.name;
    const eventValue = event.target.value;
    tempTransaction[eventName] = eventValue;

    setUpdatedTransaction(tempTransaction);
  };

  const handleCancelClick = () => {
    setIsEditEnabled(false);
    setUpdatedTransaction(originalTransaction);
  };

  return (
    <div className="DescriptionPage">
      <Button
        sx={{ position: "absolute", left: 5, top: 5 }}
        onClick={() => navigate("/")}
      >
        Home
      </Button>
      <div className="form">
        <div className="toolBar">
          {!isEditEnabled && (
            <Button onClick={() => setIsEditEnabled(true)}>Edit</Button>
          )}
        </div>
        <div className="descriptionForm">
          <TextField
            disabled={!isEditEnabled}
            margin="dense"
            name="concept"
            type="text"
            fullWidth
            variant="standard"
            helperText="Concept"
            value={
              isEditEnabled
                ? updatedTransaction.concept
                : originalTransaction.concept
            }
            onChange={(e) => handleInputChange(e)}
          />
          {originalTransaction.description !== "" ? (
            <TextField
              disabled={!isEditEnabled}
              margin="dense"
              name="description"
              type="text"
              fullWidth
              variant="standard"
              helperText="Description"
              multiline
              value={
                isEditEnabled
                  ? updatedTransaction.description
                  : originalTransaction.description
              }
              onChange={(e) => handleInputChange(e)}
            />
          ) : isEditEnabled ? (
            <TextField
              margin="dense"
              name="description"
              type="text"
              fullWidth
              variant="standard"
              helperText="Description"
              multiline
              value={
                isEditEnabled
                  ? updatedTransaction.description
                  : originalTransaction.description
              }
              onChange={(e) => handleInputChange(e)}
            />
          ) : null}

          <TextField
            disabled={!isEditEnabled}
            margin="dense"
            name="ammount"
            helperText="Ammount"
            type="number"
            fullWidth
            variant="standard"
            value={
              isEditEnabled
                ? updatedTransaction.ammount
                : originalTransaction.ammount
            }
            onChange={(e) => handleInputChange(e)}
          />
          <TextField
            disabled={!isEditEnabled}
            margin="dense"
            name="date"
            helperText="Date"
            type={"date"}
            fullWidth
            variant="standard"
            value={
              isEditEnabled ? updatedTransaction.date : originalTransaction.date
            }
            onChange={(e) => handleInputChange(e)}
          />
          <div className="formBtns">
            {isEditEnabled && (
              <>
                <Button sx={{ margin: "0 5px" }} onClick={handleCancelClick}>
                  Cancel
                </Button>
                <Button sx={{ margin: "0 5px" }} onClick={updateTransaction}>
                  Update
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
