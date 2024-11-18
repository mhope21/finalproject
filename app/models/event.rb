class Event < ApplicationRecord
  has_one :booking

  validates :title, presence: true
  validates :start_time, presence: true
  validates :end_time, presence: true
end
