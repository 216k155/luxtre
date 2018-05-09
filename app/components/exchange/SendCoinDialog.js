// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { defineMessages, intlShape } from 'react-intl';
import ReactToolboxMobxForm from '../../utils/ReactToolboxMobxForm';
import DialogCloseButton from '../widgets/DialogCloseButton';
import Dialog from '../widgets/Dialog';
import Input from 'react-polymorph/lib/components/Input';
import NumericInput from 'react-polymorph/lib/components/NumericInput';
import SimpleInputSkin from 'react-polymorph/lib/skins/simple/raw/InputSkin';
import AmountInputSkin from './skins/AmountInputSkin';
import globalMessages from '../../i18n/global-messages';
import LocalizableError from '../../i18n/LocalizableError';
import styles from './SendCoinDialog.scss';
import { formattedAmountToFloat, formattedAmountToBigNumber } from '../../utils/formatters';
import { DECIMAL_PLACES_IN_LUX, MAX_INTEGER_PLACES_IN_LUX } from '../../config/numbersConfig';

export const messages = defineMessages({
    
    receiverLabel: {
      id: 'wallet.send.form.receiver.label',
      defaultMessage: '!!!Receiver',
      description: 'Label for the "Receiver" text input in the wallet send form.'
    },
    receiverHint: {
      id: 'wallet.send.form.receiver.hint',
      defaultMessage: '!!!Wallet Address',
      description: 'Hint inside the "Receiver" text input in the wallet send form.'
    },
    amountLabel: {
      id: 'wallet.send.form.amount.label',
      defaultMessage: '!!!Amount',
      description: 'Label for the "Amount" number input in the wallet send form.'
    },
    invalidAmount: {
      id: 'wallet.send.form.errors.invalidAmount',
      defaultMessage: '!!!Please enter a valid amount.',
      description: 'Error message shown when invalid amount was entered.',
    }
});

messages.fieldIsRequired = globalMessages.fieldIsRequired;

type Props = {
    currencyMaxIntegerDigits?: number,
    currencyMaxFractionalDigits: number,
    coinName: string,
    balance: string,
    isSubmitting: boolean,
    error: ?LocalizableError,
    onCancel: Function
};

@observer
export default class ReceiveAddressDialog extends Component<Props> {

    static contextTypes = {
        intl: intlShape.isRequired,
    };

    // FORM VALIDATION
    form = new ReactToolboxMobxForm({
        fields: {
            receiver: {
            label: 'Receiver',
            placeholder: this.context.intl.formatMessage(messages.receiverHint),
            value: '',
            validators: [({ field }) => {
                if (field.value === '') {
                    return [false, this.context.intl.formatMessage(messages.fieldIsRequired)];
                }
                
                return [true];
            }],
            },
            amount: {
            label: this.context.intl.formatMessage(messages.amountLabel),
            placeholder: `0.${'0'.repeat(this.props.currencyMaxFractionalDigits)}`,
            value: '',
            validators: [async ({ field }) => {
                if (field.value === '') {
                    return [false, this.context.intl.formatMessage(messages.fieldIsRequired)];
                }
                else if(formattedAmountToFloat(field.value) > parseFloat(this.props.balance))
                {
                    return [false, this.context.intl.formatMessage(messages.invalidAmount)];
                }
                else
                    return [true, this.context.intl.formatMessage(messages.invalidAmount)];
            }],
            },
        },
        }, {
        options: {
            validateOnBlur: false,
            validateOnChange: true,
            validationDebounceWait: 250,
        },
    });

    submit() {
        this.form.submit({
          onSuccess: (form) => {
            const { coinName } = this.props;
            const { receiver, amount } = form.values();
            const transactionData = {
                coin,
                receiver,
                amount: formattedAmountToFloat(totalAmount),
            };
            this.props.onSubmit(transactionData);
          },
          onError: () => {}
        });
    }

    render() {
        const { form } = this;
        const { intl } = this.context;
        
        const {
            currencyMaxIntegerDigits, 
            currencyMaxFractionalDigits,
            coinName,
            error,
            isSubmitting,
            onCancel
        } = this.props;

        const amountField = form.$('amount');
        const receiverField = form.$('receiver');
        const amountFieldProps = amountField.bind();
        const totalAmount = formattedAmountToBigNumber(amountFieldProps.value);

        const confirmButtonClasses = classnames([
            'confirmButton',
            isSubmitting ? styles.submitButtonSpinning : null,
        ]);
      
        const actions = [
            {
              label: 'Cancel',
              onClick: !isSubmitting && onCancel,
            },
            {
              label: 'Send',
              onClick: this.submit.bind(this),
              primary: true,
              className: confirmButtonClasses,
              disabled: !amountField.isValid || !receiverField.isValid
            },
         ];

        return (
            <Dialog
                title={coinName}
                actions={actions}
                closeOnOverlayClick
                onClose={onCancel}
                className={styles.dialog}
                closeButton={<DialogCloseButton onClose={onCancel} />}
              >
                <div className={styles.receiverInput}>
                    <Input
                    className="receiver"
                    {...receiverField.bind()}
                    error={receiverField.error}
                    skin={<SimpleInputSkin />}
                    />
                </div>

                <div className={styles.amountInput}>
                    <Input
                    {...amountFieldProps}
                    className="amount"
                    label="Amount"
                    error={amountField.error}
                    // AmountInputSkin props
                    currency={coinName}
                    total={totalAmount.toFormat(currencyMaxFractionalDigits)}
                    skin={<AmountInputSkin />}
                    />
                </div>
                {error ? <p className={styles.error}>{intl.formatMessage(error)}</p> : null}
            </Dialog>
        );
    }

}
