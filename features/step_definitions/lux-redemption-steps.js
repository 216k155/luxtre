import { Given, When, Then } from 'cucumber';
import path from 'path';
import { navigateTo } from '../support/helpers/route-helpers';

const regularLuxCertificateFilePath = path.resolve(__dirname, '../support/lux_certificates/regular.pdf');
const regularEncryptedLuxCertificateFilePath = path.resolve(__dirname, '../support/lux_certificates/regular.pdf.enc');
const forceVendedLuxCertificateFilePath = path.resolve(__dirname, '../support/lux_certificates/force-vended.pdf');
const forceVendedEncryptedLuxCertificateFilePath = path.resolve(__dirname, '../support/lux_certificates/force-vended.pdf.enc');

const CERTIFICATE_UPLOAD_BOX = '.LuxRedemptionForm_certificate .LuxCertificateUploadWidget_uploadBox input';
const REDEMPTION_SUBMIT_BUTTON = '.LuxRedemptionForm_component .LuxRedemptionForm_submitButton';

Given(/^I have accepted "Luxcore Redemption Disclaimer"$/, async function () {
  await this.client.execute(() => {
    luxcore.actions.lux.luxRedemption.acceptRedemptionDisclaimer.trigger();
  });
});

Given(/^I am on the lux redemption screen$/, async function () {
  await navigateTo.call(this, '/lux-redemption');
  return this.client.waitForVisible('.LuxRedemptionForm_component');
});

Given(/^I see the "Luxcore Redemption Disclaimer" overlay$/, function () {
  return this.client.waitForVisible('.LuxRedemptionDisclaimer_component');
});

When(/^I click on the "I've understood the information above" checkbox$/, function () {
  return this.waitAndClick('.LuxRedemptionDisclaimer_component .SimpleCheckbox_root');
});

When(/^I click on the "Continue" button$/, function () {
  return this.waitAndClick('.LuxRedemptionDisclaimer_component button');
});

Then(/^I should not see the "Luxcore Redemption Disclaimer" overlay anymore$/, function () {
  return this.client.waitForVisible('.LuxRedemptionDisclaimer_component', null, true);
});

Then(/^I should(?: still)? be on the lux redemption screen$/, function () {
  return this.client.waitForVisible('.LuxRedemptionForm_component');
});

When(/^I click on lux redemption choices "([^"]*)" tab$/, function (tabText) {
  return this.waitAndClick(`//div[@class="LuxRedemptionChoices_component"]/button[contains(text(), "${tabText}")]`);
});

When(/^I enter a valid "Regular" redemption key$/, function () {
  const redemptionKey = 'llVRYvW7LAyqmDMnUOvrs5ih4OHfLiLZrz5NT+iRuTw=';
  return this.client.setValue('.LuxRedemptionForm_component .redemption-key input', redemptionKey);
});

When(/^I select a valid "Regular" PDF certificate$/, async function () {
  await this.client.chooseFile(CERTIFICATE_UPLOAD_BOX, regularLuxCertificateFilePath);
});

When(/^I select a valid "Regular" encrypted PDF certificate$/, async function () {
  await this.client.chooseFile(CERTIFICATE_UPLOAD_BOX, regularEncryptedLuxCertificateFilePath);
});

When(/^I enter a valid "Regular" encrypted PDF certificate passphrase$/, async function () {
  const passphrase = ['uncle', 'bargain', 'pistol', 'obtain', 'amount', 'laugh', 'explain', 'type', 'learn'];
  for (let i = 0; i < passphrase.length; i++) {
    const word = passphrase[i];
    await this.client.setValue('.LuxRedemptionForm_component .pass-phrase input', word);
    await this.client.waitForVisible(`//li[contains(text(), '${word}')]`);
    await this.waitAndClick(`//li[contains(text(), '${word}')]`);
    await this.client.waitForVisible(`//span[contains(text(), '${word}')]`);
  }
});

When(/^I enter a valid "Force vended" redemption key$/, function () {
  const redemptionKey = 'LtOD4vxIqfEUYheTiHprRmvmAXHvMJbulllqHhjAGHc=';
  return this.client.setValue('.LuxRedemptionForm_component .redemption-key input', redemptionKey);
});

When(/^I select a valid "Force vended" PDF certificate$/, async function () {
  await this.client.chooseFile(CERTIFICATE_UPLOAD_BOX, forceVendedLuxCertificateFilePath);
});

When(/^I select a valid "Force vended" encrypted PDF certificate$/, async function () {
  await this.client.chooseFile(CERTIFICATE_UPLOAD_BOX, forceVendedEncryptedLuxCertificateFilePath);
});

When(/^I enter a valid "Force vended" encrypted PDF certificate email, passcode and amount$/, async function () {
  const email = 'nnmbsds@example.org';
  const passcode = 'uilfeet';
  const amount = '12345';
  await this.client.setValue('.LuxRedemptionForm_component .email input', email);
  await this.client.setValue('.LuxRedemptionForm_component .lux-passcode input', passcode);
  await this.client.setValue('.LuxRedemptionForm_component .lux-amount input', amount);
});

When(/^I enter a valid "Paper vended" shielded vending key$/, function () {
  return this.client.setValue('.LuxRedemptionForm_component .shielded-redemption-key input', '6ANn43jbzR7zZGnV3BYnna1myW5HajPgjiCPg4vpcayf');
});

When(/^I enter a valid "Paper vended" shielded vending key passphrase$/, async function () {
  const passphrase = ['fitness', 'engage', 'danger', 'escape', 'marriage', 'answer', 'coffee', 'develop', 'afraid'];
  for (let i = 0; i < passphrase.length; i++) {
    const word = passphrase[i];
    await this.client.setValue('.LuxRedemptionForm_component .pass-phrase input', word);
    await this.client.waitForVisible(`//li[contains(text(), '${word}')]`);
    await this.waitAndClick(`//li[contains(text(), '${word}')]`);
    await this.client.waitForVisible(`//span[contains(text(), '${word}')]`);
  }
});

When(/^lux redemption form submit button is no longer disabled$/, function () {
  return this.client.waitForEnabled(REDEMPTION_SUBMIT_BUTTON);
});

When(/^I submit the lux redemption form$/, function () {
  return this.waitAndClick(REDEMPTION_SUBMIT_BUTTON);
});

Then(/^I should see the "Lux Redemption Success Overlay"$/, function () {
  return this.client.waitForVisible('.LuxRedemptionSuccessOverlay_component');
});
