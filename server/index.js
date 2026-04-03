import express from 'express'

import {
  createItem,
  createUser,
  deleteItem,
  deleteUser,
  findUserByCredentials,
  getItemById,
  getUserById,
  listItems,
  listUsers,
  updateItem,
} from './db.js'

const app = express()
const port = 3001

app.use(express.json())

const normalizeRole = (value) => (value === 'admin' ? 'admin' : 'user')

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'mini-rest-api', database: 'sqlite' })
})

app.get('/api/items', async (_req, res) => {
  const items = await listItems()
  res.json(items)
})

app.get('/api/items/:id', async (req, res) => {
  const itemId = Number.parseInt(req.params.id, 10)
  const item = await getItemById(itemId)

  if (!item) {
    res.status(404).json({ message: 'Item not found' })
    return
  }

  res.json(item)
})

app.post('/api/items', async (req, res) => {
  const title = typeof req.body?.title === 'string' ? req.body.title.trim() : ''

  if (!title) {
    res.status(400).json({ message: 'title is required' })
    return
  }

  const newItem = await createItem(title, Boolean(req.body?.done))
  res.status(201).json(newItem)
})

app.put('/api/items/:id', async (req, res) => {
  const itemId = Number.parseInt(req.params.id, 10)
  const existingItem = await getItemById(itemId)

  if (!existingItem) {
    res.status(404).json({ message: 'Item not found' })
    return
  }

  const title = typeof req.body?.title === 'string' ? req.body.title.trim() : existingItem.title
  const done = typeof req.body?.done === 'boolean' ? req.body.done : existingItem.done
  const updatedItem = await updateItem(itemId, title || existingItem.title, done)

  res.json(updatedItem)
})

app.delete('/api/items/:id', async (req, res) => {
  const itemId = Number.parseInt(req.params.id, 10)
  const deletedItem = await deleteItem(itemId)

  if (!deletedItem) {
    res.status(404).json({ message: 'Item not found' })
    return
  }

  res.json(deletedItem)
})

app.get('/api/users', async (_req, res) => {
  const users = await listUsers()
  res.json(users)
})

app.get('/api/users/:id', async (req, res) => {
  const userId = Number.parseInt(req.params.id, 10)
  const user = await getUserById(userId)

  if (!user) {
    res.status(404).json({ message: 'User not found' })
    return
  }

  res.json(user)
})

app.post('/api/users', async (req, res) => {
  const pseudo = typeof req.body?.pseudo === 'string' ? req.body.pseudo.trim() : ''
  const mdp = typeof req.body?.mdp === 'string' ? req.body.mdp.trim() : ''
  const role = normalizeRole(req.body?.role)

  if (!pseudo || !mdp) {
    res.status(400).json({ message: 'pseudo and mdp are required' })
    return
  }

  try {
    const newUser = await createUser(pseudo, mdp, role)
    res.status(201).json(newUser)
  } catch (error) {
    if (error instanceof Error && error.message.includes('SQLITE_CONSTRAINT')) {
      res.status(409).json({ message: 'pseudo already exists' })
      return
    }

    throw error
  }
})

app.delete('/api/users/:id', async (req, res) => {
  const userId = Number.parseInt(req.params.id, 10)
  const deletedUser = await deleteUser(userId)

  if (!deletedUser) {
    res.status(404).json({ message: 'User not found' })
    return
  }

  res.json(deletedUser)
})

app.post('/api/auth/login', async (req, res) => {
  const pseudo = typeof req.body?.pseudo === 'string' ? req.body.pseudo.trim() : ''
  const mdp = typeof req.body?.mdp === 'string' ? req.body.mdp.trim() : ''

  if (!pseudo || !mdp) {
    res.status(400).json({ message: 'pseudo and mdp are required' })
    return
  }

  const user = await findUserByCredentials(pseudo, mdp)

  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' })
    return
  }

  res.json({ user })
})

app.listen(port, () => {
  console.log(`Mini API REST running on http://localhost:${port}`)
})
