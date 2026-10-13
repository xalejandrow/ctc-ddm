import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { SaveTaskDto } from "./task.dto";
@Controller("api/tasks")
export class TasksController {
  constructor(private readonly tasks: TasksService) {}
  @Get() list() {
    return this.tasks.list();
  }
  @Post() create(@Body() body: SaveTaskDto) {
    return this.tasks.create(body);
  }
  @Patch(":id") update(@Param("id") id: string, @Body() body: SaveTaskDto) {
    return this.tasks.update(id, body);
  }
  @Delete(":id") @HttpCode(204) remove(@Param("id") id: string) {
    return this.tasks.remove(id);
  }
}
