class Api::V1::ChargesController < ApplicationController
  before_action :authenticate_user!  # Ensure the user is authenticated

  def create
    Stripe.api_key = Rails.application.credentials.dig(:stripe, :secret_key)
    Rails.logger.debug "Stripe API Key: #{Stripe.api_key}"

    amount = params[:amount]
    payment_method = params[:payment_method]

    if amount.nil? || payment_method.nil?
      render json: { error: 'Missing required parameters' }, status: :unprocessable_entity
      return
    end

    begin
      # Step 1: Create the PaymentIntent without confirming it
      payment_intent = Stripe::PaymentIntent.create(
        amount: amount,
        currency: 'usd',
        description: 'Rails Stripe customer',
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never'
        }
      )

      # Step 2: Attach the payment method to the PaymentIntent
      payment_intent = Stripe::PaymentIntent.update(
        payment_intent.id,
        payment_method: payment_method
      )

      # Step 3: Confirm the PaymentIntent
      payment_intent = Stripe::PaymentIntent.confirm(
        payment_intent.id
      )

      render json: { status: 'success', payment_intent: payment_intent }
    rescue Stripe::CardError => e
      Rails.logger.error "Stripe Card Error: #{e.message}"
      render json: { error: e.message }, status: :unprocessable_entity
    rescue Stripe::InvalidRequestError => e
      Rails.logger.error "Stripe Invalid Request Error: #{e.message}"
      render json: { error: e.message }, status: :unprocessable_entity
    rescue StandardError => e
      Rails.logger.error "General Error: #{e.message}"
      render json: { error: 'An error occurred while processing your payment' }, status: :unprocessable_entity
    end
  end
end

