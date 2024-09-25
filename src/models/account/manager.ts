import { Account } from "./entity";
import { Transfer } from "../transfer/entity";
import { AppDataSource } from "../../lib/datasource";

export class AccountManager {
  static get repository() {
    return AppDataSource.getRepository(Account);
  }

  static async createAccount(balance: number): Promise<Account> {
    return this.repository.save({
      balance,
      availableBalance: balance,
    });
  }

  static async updateAccounts(accounts: Account[]) {
    await this.repository.save(accounts);
  }

  static async reconcileBalances(id: string) {}
}
