import pet from '../fixtures/pet.json'
import { faker } from '@faker-js/faker';

pet.id = faker.number.int()
pet.name = faker.animal.cat.name
pet.category.id = faker.number.int(3)
pet.category.name = faker.animal.type()

 it('Create pet', () => {
     cy.log(`Create pet with id: ${pet.id}`)

     cy.request('POST', '/pet', pet).then( response => {
       expect(response.status).to.be.equal(200);
       expect(response.body.id).to.be.equal(pet.id);
       expect(response.body.name).to.be.equal(pet.name);
     })
 })

it.skip('Create pet', () => {
  cy.log(`Create pet with id: ${pet.id}`)

  cy.request({
    method: 'POST',
    url: '/pet',
    body: pet,
    failOnStatusCode: false
  }).then( response => {
    expect(response.status).to.be.equal(200);
    expect(response.body.id).to.be.equal(pet.id);
    expect(response.body.name).to.be.equal(pet.name);
  })
})

it('Get pet by id', () => {
  cy.log(`Get pet with id: ${pet.id}`)

  cy.request('GET', `/pet/${pet.id}`).then( response => {
    expect(response.status).to.be.equal(200);
    expect(response.body.id).to.be.equal(pet.id);
    expect(response.body.name).to.be.equal(pet.name);
    expect(response.body.category.id).to.be.equal(pet.category.id);
    expect(response.body.category.name).to.be.equal(pet.category.name);
  })
})

it('Update pet', () => {
  cy.log(`Update pet with id: ${pet.id}`)

  pet.name = 'Qweqwe';
  pet.status = 'sold'
  cy.request('PUT', '/pet', pet).then( response => {
    expect(response.status).to.be.equal(200);
    expect(response.body.id).to.be.equal(pet.id);
    expect(response.body.name).to.be.equal(pet.name);
    expect(response.body.status).to.be.equal(pet.status);
  })

  cy.request('GET', `/pet/${pet.id}`).then( response => {
    expect(response.status).to.be.equal(200);
    expect(response.body.id).to.be.equal(pet.id);
    expect(response.body.name).to.be.equal(pet.name);
    expect(response.body.category.id).to.be.equal(pet.category.id);
    expect(response.body.category.name).to.be.equal(pet.category.name);
  })
})

it('Find pet by status', () => {
  cy.log(`Find pet with id: ${pet.id}`)

  cy.request('GET', `/pet/findByStatus?status=${pet.status}`).then( response => {
    expect(response.status).to.be.equal(200);

    let pets = response.body;
    let resultPetArray = pets.filter( myPet => {
      return myPet.id === pet.id
    })

    expect(resultPetArray[0]).to.be.eql(pet);
  })
})