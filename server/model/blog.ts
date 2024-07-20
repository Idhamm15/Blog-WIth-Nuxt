import { sql } from '~~/server/db';

export type BlogModel = {
  id: number;
  title: string;
  content: string;
  created_date: string;
};

export const read = async () => {
  const result = await sql({
    query: 'SELECT id, title, content, created_date FROM blog'
  });

  return result as BlogModel[];
};

export const create = async (data: Pick<BlogModel, 'title' | 'content'>) => {
  // Melakukan insert data
  await sql({
    query: `
      INSERT INTO blog (
        title,
        content,
        created_date
      ) VALUES (
        ?,
        ?,
        CURRENT_TIMESTAMP
      )
    `,
    values: [data.title, data.content]
  });

  // Mendapatkan ID dari record yang baru saja dimasukkan
  const result = (await sql({
    query: `
      SELECT *
      FROM blog
      WHERE id = LAST_INSERT_ID()
    `
  })) as any;
  console.log('SQL Insert Result:', result); // Tambahkan log ini

  return result.length === 1 ? (result[0] as BlogModel) : null;
};

export const detail = async (id: string) => {
  const result = (await sql({
    query: 'SELECT id, title, content, created_date FROM blog WHERE id = ?',
    values: [id]
  })) as any;

  return result.length === 1 ? (result[0] as BlogModel) : null;
};

export const update = async (id: string, data: Pick<BlogModel, 'title' | 'content'>) => {
  await sql({
    query: `
      UPDATE blog
      SET
        title = ?,
        content = ?
      WHERE id = ?
    `,
    values: [data.title, data.content, id]
  });

  return await detail(id);
};

export const remove = async (id: string) => {
  await sql({
    query: 'DELETE FROM blog WHERE id = ?',
    values: [id]
  });

  return true;
};
