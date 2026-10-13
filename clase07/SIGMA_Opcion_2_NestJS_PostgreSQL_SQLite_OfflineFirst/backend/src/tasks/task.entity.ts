import { Column, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
@Entity("tasks")
export class TaskEntity {
  @PrimaryColumn() id!: string;
  @Column() title!: string;
  @Column() status!: string;
  @UpdateDateColumn() updatedAt!: Date;
}
