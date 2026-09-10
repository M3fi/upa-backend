import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateAllTables1749000000000 implements MigrationInterface {
  name = 'CreateAllTables1749000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable uuid-ossp extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // 1. users
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'email', type: 'varchar', isUnique: true },
          { name: 'password_hash', type: 'varchar' },
          { name: 'role', type: 'varchar', length: '20', default: "'STUDENT'" },
          { name: 'display_name', type: 'varchar' },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // 2. classrooms
    await queryRunner.createTable(
      new Table({
        name: 'classrooms',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'teacher_id', type: 'uuid' },
          { name: 'name', type: 'varchar' },
          { name: 'code', type: 'varchar', isUnique: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // 3. classroom_students (join table)
    await queryRunner.createTable(
      new Table({
        name: 'classroom_students',
        columns: [
          { name: 'classroom_id', type: 'uuid', isPrimary: true },
          { name: 'student_id', type: 'uuid', isPrimary: true },
          { name: 'joined_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // 4. games
    await queryRunner.createTable(
      new Table({
        name: 'games',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'teacher_id', type: 'uuid' },
          { name: 'template_type', type: 'varchar', length: '50' },
          { name: 'title', type: 'varchar' },
          { name: 'content', type: 'jsonb' },
          { name: 'rules', type: 'jsonb' },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // 5. assignments
    await queryRunner.createTable(
      new Table({
        name: 'assignments',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'game_id', type: 'uuid' },
          { name: 'classroom_id', type: 'uuid' },
          { name: 'assigned_at', type: 'timestamp', default: 'now()' },
          { name: 'due_at', type: 'timestamp', isNullable: true },
        ],
      }),
      true,
    );

    // 6. player_scores
    await queryRunner.createTable(
      new Table({
        name: 'player_scores',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'student_id', type: 'uuid' },
          { name: 'game_id', type: 'uuid' },
          { name: 'assignment_id', type: 'uuid' },
          { name: 'score', type: 'int' },
          { name: 'completed_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // 7. achievements
    await queryRunner.createTable(
      new Table({
        name: 'achievements',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'code', type: 'varchar', isUnique: true },
          { name: 'name', type: 'varchar' },
          { name: 'rarity', type: 'varchar', length: '20' },
          { name: 'criteria', type: 'jsonb' },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // 8. student_achievements
    await queryRunner.createTable(
      new Table({
        name: 'student_achievements',
        columns: [
          { name: 'student_id', type: 'uuid', isPrimary: true },
          { name: 'achievement_id', type: 'uuid', isPrimary: true },
          { name: 'unlocked_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // 9. wallets
    await queryRunner.createTable(
      new Table({
        name: 'wallets',
        columns: [
          { name: 'student_id', type: 'uuid', isPrimary: true },
          { name: 'coins', type: 'int', default: 0 },
        ],
      }),
      true,
    );

    // 10. refresh_tokens
    await queryRunner.createTable(
      new Table({
        name: 'refresh_tokens',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'user_id', type: 'uuid' },
          { name: 'token_hash', type: 'varchar' },
          { name: 'is_revoked', type: 'boolean', default: false },
          { name: 'expires_at', type: 'timestamp' },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // Indexes
    await queryRunner.createIndex('player_scores', new TableIndex({
      name: 'idx_player_scores_game_score',
      columnNames: ['game_id', 'score'],
    }));
    await queryRunner.createIndex('assignments', new TableIndex({
      name: 'idx_assignments_classroom',
      columnNames: ['classroom_id'],
    }));
    await queryRunner.createIndex('games', new TableIndex({
      name: 'idx_games_teacher_created',
      columnNames: ['teacher_id', 'created_at'],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tables = [
      'wallets', 'student_achievements', 'achievements', 'player_scores',
      'assignments', 'games', 'classroom_students', 'classrooms', 'refresh_tokens', 'users',
    ];
    for (const table of tables) {
      await queryRunner.dropTable(table);
    }
  }
}
