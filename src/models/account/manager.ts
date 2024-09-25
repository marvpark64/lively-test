import { Account } from "./entity";
import { Transfer, TransferState } from "../transfer/entity";
import { AppDataSource } from "../../lib/datasource";

export class AccountManager {
  static get repository() {
    return AppDataSource.getRepository(Account);
  }

  static async createAccount(balance: number): Promise<Account> {
    return this.repository.save({
      balance,
      availableBalance: balance,
      initialBalance: balance,
    });
  }

  static async updateAccounts(accounts: Account[]) {
    await this.repository.save(accounts);
  }

  static async reconcileBalances(id: number) {
    const account = await this.repository.findOne({ where: { id } });
    if (!account) {
      throw new Error("Account not found");
    }

    const transferRepository = AppDataSource.getRepository(Transfer);

    const incomingTransfers = await transferRepository.find({
      where: { toAccount: account, state: TransferState.COMPLETED },
    });
    const outgoingTransfers = await transferRepository.find({
      where: { fromAccount: account, state: TransferState.COMPLETED },
    });

    const initialBalance = account.initialBalance;
    const totalIncoming = incomingTransfers.reduce(
      (sum, transfer) => sum + transfer.amount,
      0
    );
    const totalOutgoing = outgoingTransfers.reduce(
      (sum, transfer) => sum + transfer.amount,
      0
    );
    const expectedBalance = initialBalance + totalIncoming - totalOutgoing;

    if (account.balance !== expectedBalance) {
      console.error(
        `Balance mismatch for account ${id}. Expected: ${expectedBalance}, Actual: ${account.balance}`
      );
    } else {
      console.log(`Account ${id} balance is correct.`);
    }
  }
}
