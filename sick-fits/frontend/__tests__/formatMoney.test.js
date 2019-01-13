import formatMoney from '../lib/formatMoney';

describe('formatMoney func', () => {
  it('works with fractional dollars', () => {
    expect(formatMoney(1)).toEqual('$0.01');
    expect(formatMoney(5)).toEqual('$0.05');
    expect(formatMoney(9)).toEqual('$0.09');
    expect(formatMoney(10)).toEqual('$0.10');
    expect(formatMoney(40)).toEqual('$0.40');
  });

  it('leaves cents off for whole dollars', () => {
    expect(formatMoney(100)).toEqual('$1');
    expect(formatMoney(5000)).toEqual('$50');
    expect(formatMoney(500000)).toEqual('$5,000');
  });

  it('works with whole and fractional dollars', () => {
    expect(formatMoney(101)).toEqual('$1.01');
    expect(formatMoney(110)).toEqual('$1.10');
    expect(formatMoney(5012)).toEqual('$50.12');
    expect(formatMoney(234857230548)).toEqual('$2,348,572,305.48');
  });
});
