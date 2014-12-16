'use strict';

describe('Create-Edit Challenge Test', function() {

  var BASE_PATH = 'http://localhost:8000/';
  var CHALLENGE_NAME = 'Protractor e2e tests Challenge';
  var CHALLENGE_OVERVIEW = 'overview saved';
  var CHALLENGE_DESCRIPTION = 'description saved';
  var CHALLENGE_REQUIREMENT_01 = 'requirement 01 saved';
  var CHALLENGE_REQUIREMENT_02 = 'requirement 02 saved';
  var CHALLENGE_ID = 345;

  // Function to redirect url if current url is not the same with target url
  var redirectUrl = function(targetUrl) {
    browser.getLocationAbsUrl().then(function(url) {
      if(url != targetUrl) browser.get(targetUrl);
    });
  };

  // Mock function to wait the url to be loaded
  var verifyUrl = function(targetUrl) {
    browser.getLocationAbsUrl().then(function(url) {
      if(url == targetUrl) return true;
    });
  };

  // Select button based on CSS selector and then click it
  var clickButton = function(css, elm) {
    var button;
    if (elm) {
      button = elm.element(by.css(css));
    } else {
      button = element.all(by.css(css)).get(0);
    }
    button.click();
  };

  // Get the test row based on current challenge id
  // Challenge id is set when test 1 is being run
  var getTestRow = function() {
    var titleContainer = element.all(by.css('a[href="/edit/#/challenges/' + CHALLENGE_ID + '/edit"]')).get(0);
    var row = titleContainer.element(by.xpath('..')).element(by.xpath('..'));
    return row;
  }

  // Get the testing row on manage challenges page and click the edit button
  var editTestRow = function() {
    var row = getTestRow();
    clickButton('a[title~="Edit"]', row);
  }

  // Get the testing row on manage challenges page and click the delete button
  var deleteTestRow = function() {
    var row = getTestRow();
    clickButton('a[title~="Delete"]', row);
  }

  browser.get(BASE_PATH + 'manage/#/challenges');

  it('1 - The user should be able to create a new challenge from manage challenges page.', function() {
    // redirect to manage challenges page if it's not yet already
    redirectUrl(BASE_PATH + 'manage/#/challenges');

    // expect to be directed to create new challenge page when clicking the add challenge button
    clickButton('a[class~="add-new"]');
    browser.getLocationAbsUrl().then(function(url) {
      expect(url.split(BASE_PATH)[1]).toMatch(/edit\/#\/challenges\/\d+\/edit/);
      CHALLENGE_ID = (url.split(BASE_PATH)[1]).split('/')[3];
    });
  });

  it('2 - The user should be able to edit the name of the challenge and save it.', function() {
    // redirect to edit challenge page if it's not yet already
    redirectUrl(BASE_PATH + 'edit/#/challenges/' + CHALLENGE_ID + '/edit');

    // Change the name of the challenge
    var titleModel = element(by.model('challenge.title'));
    titleModel.clear();
    titleModel.sendKeys(CHALLENGE_NAME);

    // Save the Challenge and then cancel Editing Mode
    clickButton('a[class~="save"]');
    clickButton('a[class~="cancel"]');

    // Check if the title that links to its edit challenge exists
    var title = element.all(by.css('a[href="/edit/#/challenges/' + CHALLENGE_ID + '/edit"]')).get(0).getText();
    expect(title).toBe(CHALLENGE_NAME);
  });

  it('3 - The user should be able to edit the overview of the challenge and save it.', function() {
    // Go to challenge edit page
    redirectUrl(BASE_PATH + 'manage/#/challenges');
    editTestRow();

    // Change the overview
    var overviewModel = element(by.model('challenge.overview'));
    overviewModel.clear();
    overviewModel.sendKeys(CHALLENGE_OVERVIEW);

    // Save the Challenge and then cancel Editing Mode
    clickButton('a[class~="save"]');
    clickButton('a[class~="cancel"]');

    // Go back to Editing Mode and expect the new overview to be there
    editTestRow();
    overviewModel = element(by.model('challenge.overview'));
    expect(overviewModel.getAttribute('value')).toBe(CHALLENGE_OVERVIEW);
  });

  it('4 - The user should be able to edit the description of the challenge and save it.', function() {
    // redirect to edit challenge page if it's not yet already
    redirectUrl(BASE_PATH + 'edit/#/challenges/' + CHALLENGE_ID + '/edit');

    // Change the description
    var descriptionModel = element(by.model('challenge.description'));
    descriptionModel.clear();
    descriptionModel.sendKeys(CHALLENGE_DESCRIPTION);

    // Save the Challenge and then cancel Editing Mode
    clickButton('a[class~="save"]');
    clickButton('a[class~="cancel"]');

    // Go back to Editing Mode and expect the new description to be there
    editTestRow();
    descriptionModel = element(by.model('challenge.description'));
    expect(descriptionModel.getAttribute('value')).toBe(CHALLENGE_DESCRIPTION);
  });

  it('5 - The user should be able to add 2 tags to an existing challenge and save it.', function() {
    // redirect to edit challenge page if it's not yet already
    redirectUrl(BASE_PATH + 'edit/#/challenges/' + CHALLENGE_ID + '/edit');

    // Add Tag 1
    var tagInput = element.all(by.css('span[class~="twitter-typeahead"] > input[class~="tt-input"]')).get(0);
    tagInput.sendKeys('node');
    tagInput.sendKeys(protractor.Key.ARROW_DOWN);
    tagInput.sendKeys(protractor.Key.ENTER);

    // Add Tag 2
    var tagInput = element.all(by.css('span[class~="twitter-typeahead"] > input[class~="tt-input"]')).get(0);
    tagInput.sendKeys('angular');
    tagInput.sendKeys(protractor.Key.ARROW_DOWN);
    tagInput.sendKeys(protractor.Key.ENTER);

    // Save the Challenge and then cancel Editing Mode
    clickButton('a[class~="save"]');
    clickButton('a[class~="cancel"]');

    // Go back to Editing Mode and expect 2 tags to be there
    editTestRow();
    var tags = element.all(by.css('div[class~="bootstrap-tagsinput"] > span[class~="tag"]'));
    expect(tags.count()).toBe(2);
  });

  it('6 - The user should be able to delete 1 tag from an existing challenge and save it.', function() {
    // redirect to edit challenge page if it's not yet already
    redirectUrl(BASE_PATH + 'edit/#/challenges/' + CHALLENGE_ID + '/edit');

    // Delete Tag 1
    var tag1 = element.all(by.css('div[class~="bootstrap-tagsinput"] > span[class~="tag"]')).get(0);
    tag1.element(by.css('span')).click();

    // Save the Challenge and then cancel Editing Mode
    clickButton('a[class~="save"]');
    clickButton('a[class~="cancel"]');

    // Go back to Editing Mode and expect 1 tag to be there
    editTestRow();
    var tags = element.all(by.css('div[class~="bootstrap-tagsinput"] > span[class~="tag"]'));
    expect(tags.count()).toBe(1);
  });

  it('7 - The user should be able to add 2 requirements to an existing challenge and save it.', function() {
    // redirect to edit challenge page if it's not yet already
    redirectUrl(BASE_PATH + 'edit/#/challenges/' + CHALLENGE_ID + '/edit');

    // Add Requirement 1
    var requirementModel = element.all(by.model('requirements.content')).get(0);
    requirementModel.sendKeys(CHALLENGE_REQUIREMENT_01);
    clickButton('a[class~="add-requirement"]');

    // Add Requirement 2
    requirementModel = element.all(by.model('requirements.content')).get(0);
    requirementModel.sendKeys(CHALLENGE_REQUIREMENT_02);
    clickButton('a[class~="add-requirement"]');

    // Save the Challenge and then cancel Editing Mode
    clickButton('a[class~="save"]');
    clickButton('a[class~="cancel"]');

    // Go back to Editing Mode and expect 2 requirements to be there
    editTestRow();
    var requirements = element.all(by.css('div[class~="requirement-list"] > div[class~="list-item"]'));
    expect(requirements.count()).toBe(2);
  });

  it('8 - The user should be able to delete 1 requirement from an existing challenge and save it.', function() {
    // redirect to edit challenge page if it's not yet already
    redirectUrl(BASE_PATH + 'edit/#/challenges/' + CHALLENGE_ID + '/edit');

    // Delete Requirement 1
    var requirement = element.all(by.css('div[class~="requirement-list"] > div[class~="list-item"]')).get(0);
    clickButton('a[class~="delete"]', requirement);

    // Save the Challenge and then cancel Editing Mode
    clickButton('a[class~="save"]');
    clickButton('a[class~="cancel"]');

    // Go back to Editing Mode and expect 1 requirement to be there
    editTestRow();
    var requirements = element.all(by.css('div[class~="requirement-list"] > div[class~="list-item"]'));
    expect(requirements.count()).toBe(1);
  });

  it('9 - The user should be able to add 2 new prizes to an existing challenge and save it.', function() {
    // redirect to edit challenge page if it's not yet already
    redirectUrl(BASE_PATH + 'edit/#/challenges/' + CHALLENGE_ID + '/edit');

    // Add Prize 1
    clickButton('a[class~="add-prize"]');
    var lastPrizeModel = element.all(by.model('place.prize')).last();
    lastPrizeModel.clear();
    lastPrizeModel.sendKeys('100');

    // Add Prize 2
    clickButton('a[class~="add-prize"]');
    var lastPrizeModel = element.all(by.model('place.prize')).last();
    lastPrizeModel.clear();
    lastPrizeModel.sendKeys('50');

    // Save the Challenge and then cancel Editing Mode
    clickButton('a[class~="save"]');
    clickButton('a[class~="cancel"]');

    // Go back to Editing Mode and expect 4 prizes to be there
    editTestRow();
    var prizeModel = element.all(by.model('place.prize'));
    expect(prizeModel.count()).toBe(4);
  });

  it('10 - The user should be able to delete a challenge.', function() {
    // Redirect to BASE_PATH+'manage/#/challenges' if it it's not there yet
    redirectUrl(BASE_PATH + 'manage/#/challenges');

    // Get the table row containing the challenge title and
    var titleContainer = element.all(by.css('a[href="/edit/#/challenges/' + CHALLENGE_ID + '/edit"]')).get(0);
    var row = titleContainer.element(by.xpath('..')).element(by.xpath('..'));

    // Click the Delete Button contained in the test row
    deleteTestRow();

    // Expect the element not to be there anymore
    var idContainers = element.all(by.css('td[data-sortable="\'id\'"]'));
    idContainers.map(function(idContainer) {
      return idContainer.getText()
    }).then(function(ids){
      expect(ids).not.toContain(CHALLENGE_ID.toString());
    });
  });
});
