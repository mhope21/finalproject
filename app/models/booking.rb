class Booking < ApplicationRecord
  belongs_to :event
  belongs_to :user

  enum status: { pending: 0, confirmed: 1, canceled: 2 }

  validates :start_time, :end_time, presence: true
  validates :status, presence: true
  validate :booking_within_event_window
  validate :user_booking_limit

  # Ensure the booking is within the event window
  def booking_within_event_window
    if start_time < event.start_time || end_time > event.end_time
      errors.add(:base, "Booking must be within the event window.")
    end
  end

  # Ensure user can only book 2 events per year
  def user_booking_limit
    bookings_in_year = user.bookings.where("extract(year from start_time) = ?", start_time.year).count
    if bookings_in_year >= 2
      errors.add(:base, "You can only book 2 events per year.")
    end
  end
end
