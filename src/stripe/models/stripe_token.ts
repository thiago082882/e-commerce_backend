export interface StripeToken {
    id:                                   string;
    object:                               string;
    amount:                               number;
    amount_capturable:                    number;
    amount_details:                       AmountDetails;
    amount_received:                      number;
    application:                          null;
    application_fee_amount:               null;
    automatic_payment_methods:            AutomaticPaymentMethods;
    canceled_at:                          null;
    cancellation_reason:                  null;
    capture_method:                       string;
    client_secret:                        string;
    confirmation_method:                  string;
    created:                              number;
    currency:                             string;
    customer:                             null;
    description:                          string;
    invoice:                              null;
    last_payment_error:                   null;
    latest_charge:                        string;
    livemode:                             boolean;
    metadata:                             Metadata;
    next_action:                          null;
    on_behalf_of:                         null;
    payment_method:                       string;
    payment_method_configuration_details: null;
    payment_method_options:               PaymentMethodOptions;
    payment_method_types:                 string[];
    processing:                           null;
    receipt_email:                        null;
    review:                               null;
    setup_future_usage:                   null;
    shipping:                             null;
    source:                               null;
    statement_descriptor:                 null;
    statement_descriptor_suffix:          null;
    status:                               string;
    transfer_data:                        null;
    transfer_group:                       null;
}

export interface AmountDetails {
    tip: Metadata;
}

export interface Metadata {
}

export interface AutomaticPaymentMethods {
    allow_redirects: string;
    enabled:         boolean;
}

export interface PaymentMethodOptions {
    card: Card;
}

export interface Card {
    installments:           null;
    mandate_options:        null;
    network:                null;
    request_three_d_secure: string;
}
