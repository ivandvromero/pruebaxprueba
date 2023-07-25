import { DateFormatHelper } from './date-format.helper';

describe('DateFormatHelper', () => {
  const helper = new DateFormatHelper();
  it('should format a date', () => {
    //arrange
    const date = new Date('2023-02-01T23:50:21.817Z');
    const expectedDate = '2023-02-01T18:50:21-05:00';
    //act
    const strDate = helper.format(date);
    //assert
    expect(strDate).toEqual(expectedDate);
  });
});
