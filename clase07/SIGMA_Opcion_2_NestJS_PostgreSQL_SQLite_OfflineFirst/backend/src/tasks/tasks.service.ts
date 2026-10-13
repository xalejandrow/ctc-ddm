import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TaskEntity } from "./task.entity";
import { SaveTaskDto } from "./task.dto";
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity) private repo: Repository<TaskEntity>,
  ) {}
  list() {
    return this.repo.find({ order: { updatedAt: "DESC" } });
  }
  create(data: SaveTaskDto) {
    return this.repo.save(data);
  }
  async update(id: string, data: SaveTaskDto) {
    const task = await this.repo.preload({ ...data, id });
    if (!task) throw new NotFoundException();
    return this.repo.save(task);
  }
  async remove(id: string) {
    await this.repo.delete(id);
  }
}
