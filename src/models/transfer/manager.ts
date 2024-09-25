import { BankApi } from "../../lib/bank-api";
import { AppDataSource } from "../../lib/datasource";
import type { Account } from "../account/entity";
import { AccountManager } from "../account/manager";
import { Transfer, TransferState } from "./entity";

interface ICreateTransferOptions {
  fromAccount: Account;
  toAccount: Account;
  amount: number;
  processImmediately?: boolean;
}

export class TransferManager {
  static get repository() {
    return AppDataSource.getRepository(Transfer);
  }

  static async createTransfer({
    fromAccount,
    toAccount,
    amount,
    processImmediately,
  }: ICreateTransferOptions): Promise<Transfer> {
    if (fromAccount.balance < amount) {
      throw new Error("Insufficient funds");
    }

    try {
      const transfer = await this.repository.save({
        fromAccount,
        toAccount,
        amount,
        state: TransferState.PENDING,
      });

      fromAccount.availableBalance -= amount;
      await AccountManager.updateAccounts([fromAccount]);
      if (processImmediately) {
        return await this.processTransfer(transfer);
      }

      return transfer;
    } catch (error) {
      throw new Error("Failed to create transfer: " + error.message);
    }
  }

  static async processTransfer(transfer: Transfer): Promise<Transfer> {
    if (transfer.state !== TransferState.PENDING) {
      throw new Error("Transfer is already processed");
    }
    try {
      await BankApi.sendMoney(
        transfer.fromAccount.id.toString(),
        transfer.toAccount.id.toString(),
        transfer.amount
      );
      transfer.state = TransferState.COMPLETED;
      transfer.fromAccount.balance -= transfer.amount;
      transfer.toAccount.balance += transfer.amount;
      try {
        await this.repository.save(transfer);
        await AccountManager.updateAccounts([
          transfer.fromAccount,
          transfer.toAccount,
        ]);
      } catch (error) {
        transfer.state = TransferState.PENDING;
        await this.repository.save(transfer);
        throw new Error("Failed to update account balances: " + error.message);
      }
    } catch (error) {
      transfer.state = TransferState.FAILED;
      throw new Error(
        "Bank API failed to process the transfer: " + error.message
      );
    }

    return this.repository.save(transfer);
  }
}
