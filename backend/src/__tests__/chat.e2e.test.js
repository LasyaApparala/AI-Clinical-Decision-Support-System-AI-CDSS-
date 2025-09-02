import request from 'supertest'
import app from '../app.js'
import mongoose from 'mongoose'
import User from '../models/User.js'

beforeAll(async ()=>{ await mongoose.connect(process.env.MONGO_URI) })
afterAll(async ()=>{ await mongoose.disconnect() })

test('auth + chat flow', async () => {
  const email = `t${Date.now()}@ex.com`
  const signup = await request(app).post('/api/auth/signup').send({ name:'t', email, password:'Secret123!' })
  expect(signup.body.token).toBeTruthy()
  const token = signup.body.token
  const session = await request(app).post('/api/chat/session').set('Authorization',`Bearer ${token}`).send({})
  expect(session.body.sessionId).toBeTruthy()
  const q = await request(app).post('/api/chat/query')
    .set('Authorization',`Bearer ${token}`)
    .send({ sessionId: session.body.sessionId, message: 'adult with fever and cough' })
  expect(q.body.answer).toBeTruthy()
  expect(Array.isArray(q.body.sources)).toBeTruthy()
})
