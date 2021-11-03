import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity} from "typeorm";

@Entity()
export class Account extends BaseEntity{

  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  balance: number;

  static async createAccount(balance: number): Promise<Account> {
    return this.create({balance}).save();
  }

  static async reconcileBalances(id: string) {
  }


}
