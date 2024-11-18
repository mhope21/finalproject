class Api::V1::BookingController < ApplicationController
  before_action :set_event, only: [ :create ]

  def create
    # Check if the event is already booked
    if @event.booked
      render json: { error: "This event is already booked." }, status: :unprocessable_entity
      return
    end

    # Create the booking within the event window
    @booking = @event.bookings.new(booking_params)
    @booking.user = current_user

    if @booking.save
      original_color = @event.color
      @event.update(booked: true, color: "#495057")

      render json: @booking, status: :created
    else
      render json: { errors: @booking.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def cancel
    @booking = Booking.find(params[:id])
    @event = @booking.event 

    # Check if `original_color` parameter exists and is provided
    if params[:original_color].present?
      if @booking.update(status: "canceled")
        @event.update(booked: false, color: params[:original_color])
        render json: { message: "Booking canceled successfully." }, status: :ok
      else
        render json: { errors: "Failed to cancel the booking." }, status: :unprocessable_entity
      end
    else
      render json: { errors: "Original color not provided." }, status: :unprocessable_entity
    end
  end
  

  private

  def set_event
    @event = Event.find(params[:event_id])
  end

  def booking_params
    params.require(:booking).permit(:start_time, :end_time, :status)
  end
end
