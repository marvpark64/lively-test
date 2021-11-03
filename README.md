Steps to run:
- run `yarn install`
- run `yarn start` to execute code in src/index.ts


Feel free to modify any existing code as you find useful, including existing entity definitions.

For simplicity, account balances and transfer amounts are assumed to be integers.

Only try to complete as many steps as you can do within one and a half hours. This is a new coding problem that we are
calibrating with and you are not expected to spend longer than that.

1. Implement Transfer.createTransfer. It should take a fromAccount, a toAccount, an amount, and optionally,
   a processImmediately flag. If processImmediately is true, BankApi.sendMoney should be called on transfer creation.
   Keep track of transfer state so that deferred transfers can be processed later. 
   
   Trying to process transfers that have already called BankApi.sendMoney should throw an error.
   Trying to send more money out of an account than the account has should throw an error.
   How and when to change account balances for pending transfers is left as a design decision.

2. Implement Account.reconcileBalances. Check that an account's current balance is as expected given the initial balance
   it was created with (passed in during Account.createAccount) and all transfers in and out. Output an error message 
   if the balance is incorrect, along with the expected and actual amounts. 
 
3. Account for the possibility that a bank-api call fails. Handle error and state management in a way that makes sense 
   to you. Consider the difference between short term and long term outages.
