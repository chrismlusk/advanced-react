function Person(name, foods) {
  this.name = name;
  this.foods = foods;
}

Person.prototype.fetchFavFoods = function() {
  return new Promise((resolve, reject) => {
    // simulate an API
    setTimeout(() => resolve(this.foods), 2000);
  });
};

describe('mocking learning', () => {
  it('mocks a regular function', () => {
    const fetchDogs = jest.fn();
    fetchDogs('ollie');
    expect(fetchDogs).toHaveBeenCalled();
    expect(fetchDogs).toHaveBeenCalledWith('ollie');
    fetchDogs('ollie');
    expect(fetchDogs).toHaveBeenCalledTimes(2);
  });

  it('can create a person', () => {
    const me = new Person('chris', ['soup', 'tacos']);
    expect(me.name).toEqual('chris');
  });

  it('can fetch favorite foods', async () => {
    const me = new Person('chris', ['soup', 'tacos']);
    // mock the `favFoods` function
    me.fetchFavFoods = jest.fn().mockResolvedValue(['sushi', 'ramen']);
    const favFoods = await me.fetchFavFoods();
    expect(favFoods).toContain('sushi');
  });
});
