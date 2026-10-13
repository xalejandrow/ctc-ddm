import { IsIn, IsString, MinLength } from "class-validator";
export class SaveTaskDto {
  @IsString() id!: string;
  @IsString() @MinLength(1) title!: string;
  @IsIn(["PENDIENTE", "FINALIZADA"]) status!: "PENDIENTE" | "FINALIZADA";
}
