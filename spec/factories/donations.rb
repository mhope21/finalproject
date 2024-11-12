FactoryBot.define do
  factory :donation do
    amount { "9.99" }
    payment_status { "string" }
    association :user
  end
end
