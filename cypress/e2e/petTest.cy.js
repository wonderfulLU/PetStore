import pet from '../fixtures/pet.json'
import { faker } from '@faker-js/faker';

pet.id = faker.number.int()
pet.name = faker.animal.cat.name
pet.category.id = faker.number.int(3)
pet.category.name = faker.animal.type()

 it('Create pet', () => {
     cy.log(`Create pet with id: ${pet.id}`)
     //cy.log(JSON.stringify(pet)) //вивести JSON пета

     cy.request('POST', '/pet', pet).then( response => {
      //console.log(response) //подивитись що у response
      //cy.log(`Request body: ${response.requestBody}`)
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

    console.log(response.body)
    console.log(response.body[0].id)

    let pets = response.body;
    let resultPetArray = pets.filter( myPet => {
      return myPet.id === pet.id
    })

    expect(resultPetArray[0]).to.be.eql(pet);
  })
})

////////////////////////////////////////////////////////////////

it('Update pet with id using form data', () => {
  cy.log(`Update pet with id ${pet.id} using form data`)  

  const data = new FormData()
    data.append('Pussy', pet.name)
    data.append('pending', pet.status)

    cy.request({
      method: 'POST',
      url: `/pet/${pet.id}`,
      body: data,
      failOnStatusCode: false
    }).then( response => {
      expect(response.status).to.be.equal(405);
      expect(response.body.id).to.be.equal(data.id);
      expect(response.body.name).to.be.equal(data.name);
    })  

  /*return await fetch('/pet/${pet.id}', {
    method: 'POST',
    body: data,
  })*/  

  cy.request('GET', `/pet/${pet.id}`).then( response => {
    expect(response.status).to.be.equal(200);
    expect(response.body.id).to.be.equal(pet.id);
    expect(response.body.name).to.be.equal(pet.name);
    expect(response.body.category.id).to.be.equal(pet.category.id);
    expect(response.body.category.name).to.be.equal(pet.category.name);
  })
})

it('Delete pet with id', () => {
  cy.log(`Delete pet with id ${pet.id}`)

  cy.request({
    method: 'DELETE',
    url: `/pet/${pet.id}`,
    //body: pet,
    failOnStatusCode: false
  }).then( response => {
    expect(response.status).to.be.equal(200);
       
  })

  cy.request({ method: 'GET', url: `/pet/${pet.id}`, failOnStatusCode: false}).then( response => {
    expect(response.status).to.be.equal(404);
    //expect(response.id).to.be.equal(400);
    
  })
})