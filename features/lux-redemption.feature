Feature: Lux Redemption

  Background:
    Given I have completed the basic setup
    And I have the following wallets:
      | name        |
      | Test wallet |

  Scenario: User accepts "Luxcore Redemption Disclaimer"
    Given I am on the lux redemption screen
    And I see the "Luxcore Redemption Disclaimer" overlay
    And I click on the "I've understood the information above" checkbox
    When I click on the "Continue" button
    Then I should not see the "Luxcore Redemption Disclaimer" overlay anymore
    And I should still be on the lux redemption screen

  Scenario: User redeems manually entered "Regular" redemption key
    Given I am on the lux redemption screen
    And I have accepted "Luxcore Redemption Disclaimer"
    And I enter a valid "Regular" redemption key
    And lux redemption form submit button is no longer disabled
    When I submit the lux redemption form
    Then I should see the "Lux Redemption Success Overlay"

  Scenario: User redeems "Regular" PDF certificate
    Given I am on the lux redemption screen
    And I have accepted "Luxcore Redemption Disclaimer"
    And I select a valid "Regular" PDF certificate
    And lux redemption form submit button is no longer disabled
    When I submit the lux redemption form
    Then I should see the "Lux Redemption Success Overlay"

  Scenario: User redeems "Regular" encrypted PDF certificate
    Given I am on the lux redemption screen
    And I have accepted "Luxcore Redemption Disclaimer"
    And I select a valid "Regular" encrypted PDF certificate
    And I enter a valid "Regular" encrypted PDF certificate passphrase
    And lux redemption form submit button is no longer disabled
    When I submit the lux redemption form
    Then I should see the "Lux Redemption Success Overlay"

  Scenario: User redeems manually entered "Force vended" redemption key
    Given I am on the lux redemption screen
    And I have accepted "Luxcore Redemption Disclaimer"
    And I click on lux redemption choices "Force vended" tab
    And I enter a valid "Force vended" redemption key
    And lux redemption form submit button is no longer disabled
    When I submit the lux redemption form
    Then I should see the "Lux Redemption Success Overlay"

  Scenario: User redeems "Force vended" PDF certificate
    Given I am on the lux redemption screen
    And I have accepted "Luxcore Redemption Disclaimer"
    And I click on lux redemption choices "Force vended" tab
    And I select a valid "Force vended" PDF certificate
    And lux redemption form submit button is no longer disabled
    When I submit the lux redemption form
    Then I should see the "Lux Redemption Success Overlay"

  Scenario: User redeems "Force vended" encrypted PDF certificate
    Given I am on the lux redemption screen
    And I have accepted "Luxcore Redemption Disclaimer"
    And I click on lux redemption choices "Force vended" tab
    And I select a valid "Force vended" encrypted PDF certificate
    And I enter a valid "Force vended" encrypted PDF certificate email, passcode and amount
    And lux redemption form submit button is no longer disabled
    When I submit the lux redemption form
    Then I should see the "Lux Redemption Success Overlay"

  Scenario: User redeems manually entered "Paper vended" shielded vending key and passphrase
    Given I am on the lux redemption screen
    And I have accepted "Luxcore Redemption Disclaimer"
    And I click on lux redemption choices "Paper vended" tab
    And I enter a valid "Paper vended" shielded vending key
    And I enter a valid "Paper vended" shielded vending key passphrase
    And lux redemption form submit button is no longer disabled
    When I submit the lux redemption form
    Then I should see the "Lux Redemption Success Overlay"
