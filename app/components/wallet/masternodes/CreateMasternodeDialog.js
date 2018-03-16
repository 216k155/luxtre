// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import Input from 'react-polymorph/lib/components/Input';
import SimpleInputSkin from 'react-polymorph/lib/skins/simple/InputSkin';
import Checkbox from 'react-polymorph/lib/components/Checkbox';
import SimpleSwitchSkin from 'react-polymorph/lib/skins/simple/SwitchSkin';
import { defineMessages, intlShape } from 'react-intl';
import ReactToolboxMobxForm from '../../../utils/ReactToolboxMobxForm';
import DialogCloseButton from '../../widgets/DialogCloseButton';
import Dialog from '../../widgets/Dialog';
import { isValidWalletPassword, isValidRepeatPassword } from '../../../utils/validations';
import globalMessages from '../../../i18n/global-messages';
import LocalizableError from '../../../i18n/LocalizableError';
import styles from './CreateMasternodeDialog.scss';

const messages = defineMessages({
  createMasternodeTitle: {
    id: 'wallet.masternode.create.dialog.title',
    defaultMessage: '!!!Create LuxNodes Node',
    description: 'Title for the "Create luxnodes node" dialog.',
  },
  nodeDescription1: {
    id: 'wallet.masternode.create.dialog.description1',
    defaultMessage: '!!!Enter an Alias(friendly name) for your LuxNodes Node and its Address(either clearnet IP and port or Tor onion address and port)',
    description: 'Description for the "Create luxnodes node" dialog.',
  },
  nodeDescription2: {
    id: 'wallet.masternode.create.dialog.description3',
    defaultMessage: '!!!A masternode pribate key and a collateral address will both be automatically generated for you',
    description: 'Description for the "Create luxnodes node" dialog.',
  },
  nodeDescription3: {
    id: 'wallet.masternode.create.dialog.description4',
    defaultMessage: '!!!You must send exactly 16120 LUX to collateral address',
    description: 'Description for the "Create luxnodes node" dialog.',
  },
  addressFieldPlaceholder: {
    id: 'wallet.masternode.create.dialog.description2',
    defaultMessage: '!!!Format : 123.456.789.123:9999 or akjdsafxjkhasdf.onion:9999',
    description: 'Description for the "Create luxnodes node" dialog.',
  },
  luxnodeAlias: {
    id: 'wallet.masternode.create.dialog.luxnodeAlias',
    defaultMessage: '!!!Alias',
    description: 'Label for the "Alias" input in the create luxnodes node dialog.',
  },
  luxnodeAddress: {
    id: 'wallet.masternode.create.dialog.luxnodeAddress',
    defaultMessage: '!!!Address',
    description: 'Label for the "Address" input in the create luxnodes node dialog.',
  },
});

type Props = {
  aliasValue: string,
  addressValue: string,
  onSave: Function,
  onCancel: Function,
  onDataChange: Function,
  isSubmitting: boolean,
  error: ?LocalizableError,
};

@observer
export default class CreateMasternodeDialog extends Component<Props, State> {

  static defaultProps = {
    aliasValue: '',
    addressValue: '',
  };

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  form = new ReactToolboxMobxForm({
    fields: {
      alias: {
        type: 'text',
        label: this.context.intl.formatMessage(messages.luxnodeAlias),
        value: '',
        validators: [({ field, form }) => {
          const aliasField = form.$('alias');
          if (aliasField.value.length > 0) aliasField.validate(form);
          return [
            isValidWalletPassword(field.value),
            this.context.intl.formatMessage(globalMessages.invalidWalletPassword)
          ];
        }],
      },
      address: {
        type: 'text',
        label: this.context.intl.formatMessage(messages.luxnodeAddress),
        placeholder: this.context.intl.formatMessage(messages.addressFieldPlaceholder),
        value: '',
        validators: [({ field, form }) => {
          const addressFieldValue = form.$('address').value;
          if (addressFieldValue.length === 0) return [true];
          return [
            isValidRepeatPassword(addressFieldValue, field.value),
            this.context.intl.formatMessage(globalMessages.invalidRepeatPassword)
          ];
        }],
      },
    }
  }, {
    options: {
      validateOnChange: true,
      validationDebounceWait: 250,
    },
  });

  submit = () => {
    this.form.submit({
      onSuccess: (form) => {
        const { alias, address } = form.values();
        const masterData = {
          alias: alias,
          address: address,
        };
        this.props.onSave(masterData);
      },
      onError: () => {},
    });
  };

  handleDataChange = (key: string, value: string) => {
    this.props.onDataChange({ [key]: value });
  };

  render() {
    const { form } = this;
    const { intl } = this.context;
    const {
      onCancel,
      aliasValue,
      addressValue,
      isSubmitting,
      error,
    } = this.props;

    const actions = [
      {
        label: 'create',
        onClick: this.submit,
        primary: true,
        className: styles.isSubmitting,
      },
    ];

    const aliasField = form.$('alias');
    const addressField = form.$('address');

    return (
      <Dialog
        title={intl.formatMessage(messages.createMasternodeTitle)}
        actions={actions}
        closeOnOverlayClick
        onClose={!isSubmitting ? onCancel : null}
        className={styles.dialog}
        closeButton={<DialogCloseButton onClose={onCancel} />}
      >
        <div className={styles.inputFields}>
          <Input
            type="text"
            className={styles.inputString}
            value={aliasValue}
            onChange={(value) => this.handleDataChange('aliasValue', value)}
            {...aliasField.bind()}
            error={aliasField.error}
            skin={<SimpleInputSkin />}
          />

          <Input
            type="text"
            className={styles.inputString}
            value={addressValue}
            onChange={(value) => this.handleDataChange('addressValue', value)}
            {...addressField.bind()}
            error={addressField.error}
            skin={<SimpleInputSkin />}
          />

          <p className={styles.instructions}>
            {intl.formatMessage(globalMessages.passwordInstructions)}
          </p>
        </div>

        {error ? <p className={styles.error}>{intl.formatMessage(error)}</p> : null}

      </Dialog>
    );
  }

}
