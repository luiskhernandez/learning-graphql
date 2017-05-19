const faker = require('faker')
const prefix = ['US','DE']
const card_states = [ 'icebox', 'backlog', 'in_progress', 'completed','accepted', 'deployed' ]
const random = n => Math.floor(Math.random() * n) +1
const roll = () => random(6)

const cards =Array.from(Array(50)).map((item, i) => {
  const number = random(5)
  return {
    id: i,
    owner_id: 1,
    estimate: random(13),
    description: faker.lorem.sentences(number),
    title: `${prefix[random(1)]}${random(3000)}`,
    type: 'Card',
    state: `${card_states[random(card_states.length)]}`,
  }
})

const users =Array.from(Array(10)).map((item, i) => {
  const number = random(5)
  return {
    id: i,
    avatar: faker.image.avatar(),
    name: faker.name.findName(),
    type: 'User'
  }
})

module.exports = {
  users,
  cards,
  roll
}
