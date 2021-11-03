import "reflect-metadata";
import {createConnection} from "typeorm";
import {Account} from "./entity/Account";
import {Transfer} from "./entity/Transfer";

createConnection().then(async connection => {
  const account1 = await Account.createAccount(50);
  console.log(account1);
  const account2 = await Account.createAccount(50);
  console.log(account2);
  const transfer = await Transfer.createTransfer({fromAccount: account1, toAccount: account2, amount: 10})
  console.log(transfer)
}).catch(error => console.log(error));
