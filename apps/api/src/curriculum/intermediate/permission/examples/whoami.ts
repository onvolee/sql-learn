import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'whoami',
  title: '当前连接的身份',
  support: 'partial',
  display: {
    sql: `SELECT current_user, session_user, current_role;
-- current_user / current_role：当前生效的 role（受 SET ROLE 影响）
-- session_user：登录时的 role（SET ROLE 不影响）`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT current_user, session_user, current_role
\`);`,
  },
  execute: (db) =>
    db.execute(sql`SELECT current_user, session_user, current_role`),
};

export default example;
