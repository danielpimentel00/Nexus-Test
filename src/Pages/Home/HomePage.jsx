import React, { useEffect, useState } from "react";
import CardComponent from "../../Components/CardComponent";
import transactionsService from "../../Services/TransactionsService";
import "./HomePage.css";

export default function HomePage() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions();
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

  return (
    <div className="HomePage">
      {transactions.map((item, index) => (
        <div className="cards">
          <CardComponent
            key={index}
            text={item.concept}
            onButtonClick={() => console.log("clicked")}
          />
        </div>
      ))}
    </div>
  );
}
