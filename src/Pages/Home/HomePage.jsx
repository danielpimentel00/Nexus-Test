import React, { useEffect, useState, useRef } from "react";
import CardComponent from "../../Components/CardComponent";
import transactionsService from "../../Services/TransactionsService";
import "./HomePage.css";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
  Alert,
  Collapse,
  InputBase,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

export default function HomePage() {
  const [transactions, setTransactions] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAlertOpened, setIsAlertOpened] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [newTransaction, setNewTransaction] = useState({
    concept: "",
    description: "",
    ammount: 0,
    date: "",
    accountId: "",
  });

  const dataRef = useRef(true);

  useEffect(() => {
    getTransactions();
    getAccounts();
  }, []);

  const getTransactions = () => {
    transactionsService
      .getTransactions()
      .then((res) => {
        setTransactions(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAccounts = () => {
    transactionsService
      .getAccounts()
      .then((res) => {
        const result = res.data;
        let ids = [];
        result.map((item) => ids.push(item.id));
        setAccounts(ids);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const createTransaction = () => {
    transactionsService
      .postTransaction({
        concept: newTransaction.concept,
        description: newTransaction.description,
        ammount: newTransaction.ammount,
        date: newTransaction.date,
        accountId: newTransaction.accountId,
        candidateId: process.env.REACT_APP_USER_ID,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteTransaction = (index) => {
    const transaction = transactions[index];

    if (transaction.candidateId === process.env.REACT_APP_USER_ID) {
      transactionsService
        .deleteTransaction(transaction.id)
        .then((res) => {
          console.log(res);
          setTransactions((previousTransactions) =>
            previousTransactions.filter((item) => item.id !== transaction.id)
          );
        })
        .catch((err) => console.log(err));
    } else {
      setTransactions((previousTransactions) =>
        previousTransactions.filter((item) => item.id !== transaction.id)
      );
    }
  };

  const displayTransactions = () => {
    const trans = transactions
      .filter((item) => {
        if (searchInput === "") {
          return item;
        } else if (
          item.concept.toLowerCase().includes(searchInput.toLowerCase())
        ) {
          return item;
        }
      })
      .map((item, index) => {
        return (
          <div className={"card"} key={index}>
            <CardComponent
              text={item.concept}
              onButtonClick={() => deleteTransaction(index)}
            />
          </div>
        );
      });

    if (trans.length === 0 && dataRef.current === true) {
      dataRef.current = false;
    } else if (trans.length > 0 && dataRef.current === false) {
      dataRef.current = true;
    }

    return <div className="transactionCards">{trans}</div>;
  };

  const displayLabel = () => {
    if (!dataRef.current) {
      return (
        <div className={"label"}>
          <p>No data found</p>
        </div>
      );
    } else {
      return <></>;
    }
  };

  const sortTransactionsAsc = () => {};

  const openForm = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);

    setNewTransaction({
      concept: "",
      description: "",
      ammount: 0,
      date: "",
      accountId: "",
    });
  };

  const handleInputChange = (event) => {
    let tempTransaction = { ...newTransaction };
    const eventName = event.target.name;
    const eventValue = event.target.value;
    tempTransaction[eventName] = eventValue;

    setNewTransaction(tempTransaction);
  };

  const validateSearchInput = (event) => {
    const inputString = event.target.value;
    const inputChar = inputString.substring(inputString.length - 1);
    const regex = /[A-Za-z 0-9]/;
    const isCharValid = regex.test(inputChar);

    // if()

    console.log(inputChar);

    setSearchInput(inputString);
  };

  const validateForm = () => {
    const concept = newTransaction.concept.trim();
    const description = newTransaction.description.trim();
    const ammount = newTransaction.ammount;
    const date = newTransaction.date;
    const accountId = newTransaction.accountId;

    const isFormInputValid =
      concept !== "" &&
      description !== "" &&
      ammount > 0 &&
      date !== "" &&
      accounts.includes(accountId);

    if (!isFormInputValid) {
      if (concept === "") {
        setIsAlertOpened(true);
        setAlertMessage("Concept field is required");
      } else if (description === "") {
        setIsAlertOpened(true);
        setAlertMessage("Description field is required");
      } else if (ammount <= 0) {
        setIsAlertOpened(true);
        setAlertMessage("Invalid Ammount");
      } else if (date === "") {
        setIsAlertOpened(true);
        setAlertMessage("Date field is required");
      } else if (accountId === "") {
        setIsAlertOpened(true);
        setAlertMessage("Account Id field is required");
      } else {
        setIsAlertOpened(true);
        setAlertMessage("Invalid Account Id");
      }
    } else {
      setIsAlertOpened(false);

      createTransaction();

      setNewTransaction({
        concept: "",
        description: "",
        ammount: 0,
        date: "",
        accountId: "",
      });

      setIsFormOpen(false);
    }
  };

  return (
    <div className="HomePage">
      <div className="toolBar">
        <Button
          id="createButton"
          variant="contained"
          size="medium"
          color="success"
          onClick={openForm}
        >
          Create Transaction
        </Button>

        <TextField
          sx={{ color: "#fff" }}
          label="Search..."
          margin="dense"
          type="text"
          variant="filled"
          onChange={(e) => validateSearchInput(e)}
        />
      </div>

      {displayLabel()}

      {displayTransactions()}

      <Dialog open={isFormOpen} onClose={closeForm}>
        <DialogTitle>
          Create Transaction
          <Collapse in={isAlertOpened}>
            <Alert variant="outlined" severity="error">
              {alertMessage}
            </Alert>
          </Collapse>
        </DialogTitle>

        <DialogContent>
          {/* <ValidatorForm
            // ref="form"
            onSubmit={createTransaction}
            onError={(err) => console.log(err)}
          >
            <TextValidator
              helperText="Concept *"
              name="concept"
              type="text"
              fullWidth
              margin="dense"
              variant="standard"
              value={newTransaction.concept}
              onChange={(e) => handleInputChange(e)}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />
            <TextValidator
              helperText="Date *"
              name="date"
              type="date"
              fullWidth
              margin="dense"
              variant="standard"
              value={newTransaction.date}
              onChange={(e) => handleInputChange(e)}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />
            <Button type="submit">Submit</Button>
          </ValidatorForm> */}
          <TextField
            autoFocus
            required
            margin="dense"
            name="concept"
            type="text"
            fullWidth
            variant="standard"
            helperText="Concept *"
            value={newTransaction.concept}
            onChange={(e) => handleInputChange(e)}
          />
          <TextField
            required
            margin="dense"
            name="description"
            type="text"
            fullWidth
            variant="standard"
            helperText="Description *"
            multiline
            value={newTransaction.description}
            onChange={(e) => handleInputChange(e)}
          />
          <TextField
            required
            margin="dense"
            name="ammount"
            helperText="Ammount *"
            type="number"
            fullWidth
            variant="standard"
            value={newTransaction.ammount}
            onChange={(e) => handleInputChange(e)}
          />
          <TextField
            required
            margin="dense"
            name="date"
            helperText="Date *"
            type="date"
            fullWidth
            variant="standard"
            value={newTransaction.date}
            onChange={(e) => handleInputChange(e)}
          />
          <TextField
            required
            margin="dense"
            name="accountId"
            helperText="Account Id *"
            type="text"
            fullWidth
            variant="standard"
            value={newTransaction.accountId}
            onChange={(e) => handleInputChange(e)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={closeForm}>Cancel</Button>
          <Button onClick={validateForm}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
