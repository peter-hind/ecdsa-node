const express = require('express')
const app = express()
const cors = require('cors')
const port = 3042

app.use(cors())
app.use(express.json())

const balances = {
  '02570e7faa7c19e4afec24bcd97931acb099506dc5e05acd0b3ece3cf018d9ee1a': 100,
  '030df2ef9bd5a83f4472300d8a9ade6b949ea5537d61510c54e423cbd6a3955ac0': 50,
  '0x3': 75,
}

app.get('/balance/:address', (req, res) => {
  const { address } = req.params
  const balance = balances[address] || 0
  res.send({ balance })
})

app.post('/send', (req, res) => {
  // TODO: get signature and recover PubKey

  const { sender, recipient, amount } = req.body

  setInitialBalance(sender)
  setInitialBalance(recipient)

  if (balances[sender] < amount) {
    res.status(400).send({ message: 'Not enough funds!' })
  } else {
    balances[sender] -= amount
    balances[recipient] += amount
    res.send({ balance: balances[sender] })
  }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}!`)
})

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0
  }
}
