import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { open } from 'sqlite'
import sqlite3 from 'sqlite3'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, 'data')
const databasePath = path.join(dataDir, 'app.sqlite')

let databasePromise

const serializeItem = (row) => ({
  id: row.id,
  title: row.title,
  done: Boolean(row.done),
})

const serializeUser = (row) => ({
  id: row.id,
  pseudo: row.pseudo,
  role: row.role,
})

async function seedDatabase(database) {
  const itemCountRow = await database.get('SELECT COUNT(*) AS count FROM items')
  const userCountRow = await database.get('SELECT COUNT(*) AS count FROM users')

  if (itemCountRow.count === 0) {
    const defaultItems = [
      ['Configurer Express', 1],
      ['Ajouter les routes REST', 1],
      ['Tester depuis Vue', 0],
    ]

    for (const [title, done] of defaultItems) {
      await database.run('INSERT INTO items (title, done) VALUES (?, ?)', title, done)
    }
  }

  if (userCountRow.count === 0) {
    const defaultUsers = [
      ['admin', 'admin123', 'admin'],
      ['demo', 'demo123', 'user'],
    ]

    for (const [pseudo, mdp, role] of defaultUsers) {
      await database.run(
        'INSERT INTO users (pseudo, mdp, role) VALUES (?, ?, ?)',
        pseudo,
        mdp,
        role,
      )
    }
  }
}

async function createDatabase() {
  await fs.mkdir(dataDir, { recursive: true })

  const database = await open({
    filename: databasePath,
    driver: sqlite3.Database,
  })

  await database.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pseudo TEXT NOT NULL UNIQUE,
      mdp TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('admin', 'user'))
    );
  `)

  await seedDatabase(database)

  return database
}

export async function getDatabase() {
  if (!databasePromise) {
    databasePromise = createDatabase()
  }

  return databasePromise
}

export async function listItems() {
  const database = await getDatabase()
  const rows = await database.all('SELECT id, title, done FROM items ORDER BY id DESC')
  return rows.map(serializeItem)
}

export async function getItemById(id) {
  const database = await getDatabase()
  const row = await database.get('SELECT id, title, done FROM items WHERE id = ?', id)
  return row ? serializeItem(row) : null
}

export async function createItem(title, done = false) {
  const database = await getDatabase()
  const result = await database.run(
    'INSERT INTO items (title, done) VALUES (?, ?)',
    title,
    done ? 1 : 0,
  )
  return { id: result.lastID, title, done }
}

export async function updateItem(id, title, done) {
  const database = await getDatabase()
  await database.run('UPDATE items SET title = ?, done = ? WHERE id = ?', title, done ? 1 : 0, id)
  return getItemById(id)
}

export async function deleteItem(id) {
  const database = await getDatabase()
  const item = await getItemById(id)

  if (!item) {
    return null
  }

  await database.run('DELETE FROM items WHERE id = ?', id)
  return item
}

export async function listUsers() {
  const database = await getDatabase()
  const rows = await database.all('SELECT id, pseudo, mdp, role FROM users ORDER BY id DESC')
  return rows.map(serializeUser)
}

export async function getUserById(id) {
  const database = await getDatabase()
  const row = await database.get('SELECT id, pseudo, mdp, role FROM users WHERE id = ?', id)
  return row ? serializeUser(row) : null
}

export async function createUser(pseudo, mdp, role) {
  const database = await getDatabase()
  const result = await database.run(
    'INSERT INTO users (pseudo, mdp, role) VALUES (?, ?, ?)',
    pseudo,
    mdp,
    role,
  )

  return {
    id: result.lastID,
    pseudo,
    role,
  }
}

export async function deleteUser(id) {
  const database = await getDatabase()
  const user = await getUserById(id)

  if (!user) {
    return null
  }

  await database.run('DELETE FROM users WHERE id = ?', id)
  return user
}

export async function findUserByCredentials(pseudo, mdp) {
  const database = await getDatabase()
  const row = await database.get(
    'SELECT id, pseudo, mdp, role FROM users WHERE pseudo = ? AND mdp = ?',
    pseudo,
    mdp,
  )

  return row ? serializeUser(row) : null
}
