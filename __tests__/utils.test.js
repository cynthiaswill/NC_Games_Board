const { createRef } = require('../utils/utils');

describe('createRef', () => {
    it('returns an empty object, when passed an empty array', () => {
      const input = [];
      const key ='';
      const value = '';
      const actual = createRef(input, key, value);
      const expected = {};
      expect(actual).toEqual(expected);
    });
    it('returns reference object that can be used to look up more flexible arguments, it returns a new array, original array not mutated', () => {
      const people = [
        { name: 'vel', phoneNumber: '01134445566', address: 'Northcoders, Leeds' },
        {
          name: 'ant',
          phoneNumber: '01612223344',
          address: 'Northcoders, Manchester'
        },
        { name: 'mitch', phoneNumber: '07777777777', address: null }
      ];
      const actual = createRef(people, 'name', 'phoneNumber');
      const expected = { vel: '01134445566', ant: '01612223344', mitch: '07777777777' };
      expect(actual).toEqual(expected);
      expect(expected).not.toBe(people); // testing returns new array
      expect(people).toEqual([
        { name: 'vel', phoneNumber: '01134445566', address: 'Northcoders, Leeds' },
        {
          name: 'ant',
          phoneNumber: '01612223344',
          address: 'Northcoders, Manchester'
        },
        { name: 'mitch', phoneNumber: '07777777777', address: null }
      ])      // testing not mutated original
  
      expect(createRef(people, 'name', 'address')).toEqual({ vel: 'Northcoders, Leeds', ant: 'Northcoders, Manchester', mitch: null })
    });   // testing other parameters as arguments
  });