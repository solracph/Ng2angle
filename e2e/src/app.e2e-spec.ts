import { SCRAPage } from './app.po';

describe('SCRA App', function() {
  let page: SCRAPage;

  beforeEach(() => {
    page = new SCRAPage();
  });

  it('should display Angle in h1 tag', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Angle');
  });
});
