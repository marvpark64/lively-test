export class BankApi {
  private static isApiAvailable(): boolean {
    return true
  }

  static sendMoney(fromAccountId: string, toAccountId: string, amount: number) {
    if (!this.isApiAvailable()) {
      throw new Error('BankApi is down, money movement failed')
    }
  }
}
