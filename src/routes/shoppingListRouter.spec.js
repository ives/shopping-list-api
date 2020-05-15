// const shoppingListRouter = require('./shoppingListRouter')();

const assert = require('assert');
const should = require('chai').should();

// should can only be included in one test

describe('basic test', () => {
  it('should deal with Objects', () => {
    const obj = { name: 'Ives', gender: 'male' };
    const objB = { name: 'Ives', gender: 'male' };

    obj.should.have.property('name');
    obj.should.have.property('name').equal('Ives');

    // Compare Obj - use deep, else checks if instance of same Obj
    obj.should.deep.equal(objB);
  });

  it.skip('should FAIL on purpose', () => {
    assert.equal(1, 2);
  });
});
