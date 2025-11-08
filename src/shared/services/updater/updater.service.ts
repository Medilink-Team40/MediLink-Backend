import { Injectable } from '@nestjs/common';
import { DeepPartial, FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class UpdaterService {
  public static async upsert<T extends ObjectLiteral, K extends keyof T>(
    repository: Repository<T>,
    data: Partial<T>[],
    matchColumn: K,
    matchParent: FindOptionsWhere<T>,
  ) {
    const existingRecords = await repository.findBy(matchParent);
    const incomingValues = data.map((item) => item[matchColumn]).filter((value): value is T[K] => !!value);
    const recordsToDelete = existingRecords.filter(
      (record) => record[matchColumn] && !incomingValues.includes(record[matchColumn]),
    );

    const recordsToSaveOrUpdate = data.map((dto) => {
      const entityData = { ...dto, ...matchParent };
      const existingMatch = existingRecords.find((e) => e[matchColumn] === dto[matchColumn]);
      return existingMatch
        ? repository.merge(existingMatch, entityData as DeepPartial<T>)
        : repository.create(entityData as DeepPartial<T>);
    });

    await repository.manager.transaction(async (trx) => {
      if (recordsToDelete.length > 0) {
        await trx.remove(recordsToDelete);
      }
      if (recordsToSaveOrUpdate.length > 0) {
        await trx.save(recordsToSaveOrUpdate);
      }
    });
  }
}
