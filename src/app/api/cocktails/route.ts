// This API route uses Node.js modules (sqlite3, path) which are supported in Next.js API routes (app/api/*)
import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import path from 'path';

export async function GET(): Promise<NextResponse> {
  return new Promise((resolve, reject) => {
    const dbPath = path.join(process.cwd(), 'public', 'all_drinks.db');
    const db = new sqlite3.Database(dbPath, (err: Error | null) => {
      if (err) {
        reject(
          NextResponse.json(
            { error: 'Failed to connect to database', details: err.message },
            { status: 500 }
          )
        );
      }
    });

    db.all(
      'SELECT * FROM all_drinks',
      [],
      (err: Error | null, rows: { [key: string]: string }[]) => {
        if (err) {
          reject(NextResponse.json({ error: err.message }, { status: 500 }));
        } else {
          resolve(NextResponse.json(rows));
        }
        db.close();
      }
    );
  });
}
