const { createRef } = require('./utils');

describe('createRef', () => {
    it('returns an empty object, when passed an empty array', () => {
      const input = [];
      const key ='';
      const value = '';
      const actual = createRef(input, key, value);
      const expected = {};
      expect(actual).toEqual(expected);
    });

    describe('testing reference object can be used to look up more flexible arguments', () => {
      const people = [
        { name: 'vel',
         phoneNumber: '01134445566',
          address: 'Northcoders, Leeds'
        },
        {
          name: 'ant',
          phoneNumber: '01612223344',
          address: 'Northcoders, Manchester'
        },
        { name: 'mitch',
         phoneNumber: '07777777777',
          address: null 
        }
      ];
      const actual = createRef(people, 'name', 'phoneNumber');
      const expected = { vel: '01134445566',
            ant: '01612223344',
            mitch: '07777777777' 
        };
        test('look up more flexible arguments returns correct lookup object', ()=> {
            expect(actual).toEqual(expected);
        })
        test('createRef returns new array', ()=> {
            expect(expected).not.toBe(people);
        })
        test('createRef not mutating original input', ()=> {
            expect(people).toEqual([
            { name: 'vel',
            phoneNumber: '01134445566',
            address: 'Northcoders, Leeds' 
            },
            {
            name: 'ant',
            phoneNumber: '01612223344',
            address: 'Northcoders, Manchester'
            },
            { name: 'mitch',
            phoneNumber: '07777777777',
            address: null 
            }
            ]);
        });
            test('createRef testing other parameters as arguments returns correct result', ()=> {
            expect(createRef(people, 'name', 'address'))
            .toEqual({
              vel: 'Northcoders, Leeds',
              ant: 'Northcoders, Manchester',
              mitch: null 
            })
        });
    }); 
  });

