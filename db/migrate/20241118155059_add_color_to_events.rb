class AddColorToEvents < ActiveRecord::Migration[7.2]
  def change
    add_column :events, :color, :string
  end
end
