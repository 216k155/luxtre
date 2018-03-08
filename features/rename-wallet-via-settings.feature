Feature: Rename Wallet via Settings

  Background:
    Given I have completed the basic setup
    And I have the following wallets:
      | name        |
      | Test wallet |

  Scenario: Successfully Deleting a Wallet
    Given I am on the "Test wallet" wallet "settings" screen
    When I click on Rename Wallet button
    And I see Rename Wallet dialog
    And I click on the "Make sure you have access to backup before continuing" checkbox
    And I enter "Test wallet" as name of the wallet to confirm
    And I submit the Rename Wallet dialog
    Then I should not see the Rename Wallet dialog anymore
