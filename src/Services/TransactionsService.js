import axios from "axios";

class TransactionsService {
  _axiosInstance;

  constructor() {
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: { Authorization: process.env.REACT_APP_USER_ID },
    });

    this._axiosInstance = axiosInstance;
  }

  getTransactions() {
    return new Promise((resolve, reject) => {
      this._axiosInstance
        .get("/transactions")
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  }

  getAccounts() {
    return new Promise((resolve, reject) => {
      this._axiosInstance
        .get("/accounts")
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  }

  postTransaction(body) {
    return new Promise((resolve, reject) => {
      this._axiosInstance
        .post("/transactions", body)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  }

  putTransaction(body) {
    return new Promise((resolve, reject) => {
      this._axiosInstance
        .put("/transactions", body)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  }
}

var transactionsService = new TransactionsService();
export default transactionsService;
