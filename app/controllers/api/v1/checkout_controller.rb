class Api::V1::CheckoutController < ApplicationController
  
  before_action :authenticate_user!, except: [:show]  # Ensure the user is authenticated

  def create
    Stripe.api_key = Rails.application.credentials.dig(:stripe, :secret_key)

    amount = params[:amount].to_i

    session = Stripe::Checkout::Session.create(
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Donation',
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/cancel",
    )

    render json: { id: session.id }
  rescue Stripe::StripeError => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

def show
  Stripe.api_key = Rails.application.credentials.dig(:stripe, :secret_key)
  session = Stripe::Checkout::Session.retrieve(params[:id])
  render json: session
rescue Stripe::StripeError => e
  render json: { error: e.message }, status: :unprocessable_entity
end
  
end
