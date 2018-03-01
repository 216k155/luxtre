Feature: Navigate Sidebar Categories

  Background:
    Given I have completed the basic setup
    And I have the following wallets:
      | name        |
      | Test wallet |

  Scenario Outline: Navigate Between Sidebar Categories
    Given The sidebar shows the "<FROM>" category
    When I click on the "<TO>" category in the sidebar
    Then The "<TO>" category should be active

    Examples:
    | FROM           | TO             |
    | wallets        | lux-redemption |
    | lux-redemption | wallets        |

  Scenario: Navigate from a Wallet to Lux Redemption screen
    Given I am on the "Test wallet" wallet "summary" screen
    And The sidebar shows the "wallets" category
    When I click on the "lux-redemption" category in the sidebar
    Then I should be on the lux redemption screen

  Scenario: Open Wallets Menu from Lux Redemption Screen
    Given I am on the lux redemption screen
    And The sidebar shows the "lux-redemption" category
    When I click on the "wallets" category in the sidebar
    Then The "wallets" category should be active
    But I should be on the "Test wallet" wallet "summary" screen
