import { DB } from "sqlite";

const dbpath = "bonks.db";

class BonkStore {
  constructor() {
    this.initDB();
  }

  get state(): Readonly<Record<string, number>> {
    const db = new DB(dbpath);
    let rows;
    try {
      rows = db.query(`SELECT name, count from bonks_v1`);
    } finally {
      db.close();
    }
    return Object.fromEntries(rows);
  }

  public incrementBonk(name: string, incrementBy: number) {
    const db = new DB(dbpath);
    try {
      db.query(`UPDATE bonks_v1 SET count = count + ? WHERE name = ?`, [
        incrementBy,
        name,
      ]);
      if (db.changes === 0) {
        db.query(`INSERT INTO bonks_v1 (name, count) VALUES (?, ?)`, [
          name,
          incrementBy,
        ]);
      }
    } finally {
      db.close();
    }
  }

  public setBonk(name: string, count: number) {
    const db = new DB(dbpath);
    try {
      db.query(`UPDATE bonks_v1 SET count = ? WHERE name = ?`, [count, name]);
      if (db.changes === 0) {
        db.query(`INSERT INTO bonks_v1 (name, count) VALUES (?, ?)`, [
          name,
          count,
        ]);
      }
    } finally {
      db.close();
    }
  }

  private initDB() {
    const db = new DB(dbpath);
    try {
      db.execute(`
      CREATE TABLE IF NOT EXISTS bonks_v1 (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        count INTEGER NOT NULL
      )`);
    } finally {
      db.close();
    }
  }
}

export const bonkStore = new BonkStore();
