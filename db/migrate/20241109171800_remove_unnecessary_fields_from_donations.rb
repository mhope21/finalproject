class RemoveUnnecessaryFieldsFromDonations < ActiveRecord::Migration[7.2]
  def change
    remove_column :donations, :save_payment_info, :boolean
    remove_column :donations, :payment_token, :string
  end
end
