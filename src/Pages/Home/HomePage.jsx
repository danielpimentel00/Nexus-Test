import React, { useEffect, useState, useRef } from "react";
import CardComponent from "../../Components/CardComponent";
import transactionsService from "../../Services/TransactionsService";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
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

export default function HomePage() {
  const [transactions, setTransactions] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFormAlertOpened, setIsFormAlertOpened] = useState(false);
  const [isInputValid, setIsInputValid] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [transactionsOrder, setTransactionsOrder] = useState(0); //0: Default, 1: Ascending, 2: Descending
  const [newTransaction, setNewTransaction] = useState({
    concept: "",
    description: "",
    ammount: 0,
    date: "",
    accountId: "",
  });

  const dataRef = useRef(true);

  const navigate = useNavigate();

  useEffect(() => {
    getTransactions();
    getAccounts();
    sortTransactionsAsc();
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
        getTransactions();
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

  const sortTransactions = () => {
    if (transactionsOrder === 0 || transactionsOrder === 2) {
      setTransactionsOrder(1);
      sortTransactionsAsc();
    } else {
      setTransactionsOrder(2);
      sortTransactionsDesc();
    }
  };

  const sortTransactionsAsc = () => {
    const ascendingTrans = [...transactions].sort((a, b) =>
      a.concept > b.concept ? 1 : -1
    );

    setTransactions(ascendingTrans);
  };

  const sortTransactionsDesc = () => {
    const descendingTrans = [...transactions].sort((a, b) =>
      a.concept > b.concept ? -1 : 1
    );

    setTransactions(descendingTrans);
  };

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

  const viewTransactionDescription = (index) => {
    const id = transactions[index].id;
    navigate(`/description/${id}`);
  };

  const validateSearchInput = (event) => {
    const inputString = event.target.value;
    const regex = /[A-Za-z 0-9]/;
    let isCharValid = true;

    for (let i = 0; i < inputString.length; i++) {
      const character = inputString[i];

      if (!regex.test(character)) {
        isCharValid = false;
        break;
      }
    }

    if (!isCharValid) {
      setIsInputValid(false);
    } else {
      setIsInputValid(true);
    }

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
        setIsFormAlertOpened(true);
        setAlertMessage("Concept field is required");
      } else if (description === "") {
        setIsFormAlertOpened(true);
        setAlertMessage("Description field is required");
      } else if (ammount <= 0) {
        setIsFormAlertOpened(true);
        setAlertMessage("Invalid Ammount");
      } else if (date === "") {
        setIsFormAlertOpened(true);
        setAlertMessage("Date field is required");
      } else if (accountId === "") {
        setIsFormAlertOpened(true);
        setAlertMessage("Account Id field is required");
      } else {
        setIsFormAlertOpened(true);
        setAlertMessage("Invalid Account Id");
      }
    } else {
      setIsFormAlertOpened(false);

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
          <div key={index}>
            <CardComponent
              text={item.concept}
              onCardClick={() => viewTransactionDescription(index)}
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

        <div className="toolBarFilterElements">
          <TextField
            id="searchField"
            sx={{ color: "#fff", width: 400, marginRight: 2 }}
            label="Search..."
            type="text"
            variant="filled"
            onChange={(e) => validateSearchInput(e)}
          />

          <Button
            color="primary"
            variant="contained"
            aria-label="sort-transactions"
            onClick={() => sortTransactions()}
          >
            Sort
          </Button>
        </div>
      </div>

      <div>
        <Collapse in={!isInputValid} sx={{ width: 300, marginTop: 2 }}>
          <Alert variant="filled" severity="error">
            Invalid Input
          </Alert>
        </Collapse>
      </div>

      {displayLabel()}

      {displayTransactions()}

      <Dialog open={isFormOpen} onClose={closeForm}>
        <DialogTitle>
          Create Transaction
          <Collapse in={isFormAlertOpened}>
            <Alert variant="filled" severity="error">
              {alertMessage}
            </Alert>
          </Collapse>
        </DialogTitle>

        <DialogContent>
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
