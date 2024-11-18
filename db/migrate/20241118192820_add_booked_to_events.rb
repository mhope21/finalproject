class AddBookedToEvents < ActiveRecord::Migration[7.2]
  def change
    add_column :events, :booked, :boolean, default: false
  end
end
