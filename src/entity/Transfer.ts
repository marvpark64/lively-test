import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity} from "typeorm";
import {Account} from "./Account";

interface ICreateTransferOptions {
  fromAccount: Account;
  toAccount: Account;
  amount: number;
  processImmediately?: boolean;
}

@Entity()
export class Transfer extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Account)
  fromAccount: Account

  @ManyToOne((type) => Account)
  toAccount: Account

  @Column('int')
  amount: number;

  @Column('text', {nullable: true})
  state: any;

  static async createTransfer({fromAccount, toAccount, amount, processImmediately}: ICreateTransferOptions ): Promise<Transfer> {
    return this.create({
      fromAccount,
      toAccount,
      amount
    }).save();
    return {} as any
  }


}
