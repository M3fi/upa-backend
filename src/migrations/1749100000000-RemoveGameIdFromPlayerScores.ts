import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveGameIdFromPlayerScores1749100000000 implements MigrationInterface {
  name = 'RemoveGameIdFromPlayerScores1749100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the redundant game_id column from player_scores.
    // game_id can be derived from assignment_id via the assignments table.
    await queryRunner.dropColumn('player_scores', 'game_id');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restore game_id column
    await queryRunner.addColumn(
      'player_scores',
      new TableColumn({
        name: 'game_id',
        type: 'uuid',
      }),
    );
  }
}
