import "reflect-metadata";
import { AccountManager } from "./models/account/manager";
import { TransferManager } from "./models/transfer/manager";
import { createConnection } from "./lib/datasource";

createConnection()
  .then(async (connection) => {
    const account1 = await AccountManager.createAccount(50);
    console.log(account1);
    const account2 = await AccountManager.createAccount(50);
    console.log(account2);
    const transfer = await TransferManager.createTransfer({
      fromAccount: account1,
      toAccount: account2,
      amount: 10,
      // processImmediately: true,
    });
    console.log(transfer);

    // Simulate a balance discrepancy
    account1.balance = 40;
    await AccountManager.updateAccounts([account1]);
    await AccountManager.reconcileBalances(account1.id);
    await AccountManager.reconcileBalances(account2.id);
  })
  .catch((error) => console.log(error));
