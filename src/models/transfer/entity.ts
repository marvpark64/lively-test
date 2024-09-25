import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Account } from "../account/entity";

export enum TransferState {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

@Entity()
export class Transfer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Account)
  fromAccount: Account;

  @ManyToOne((type) => Account)
  toAccount: Account;

  @Column("int")
  amount: number;

  @Column("text", { default: TransferState.PENDING })
  state: TransferState;
}
