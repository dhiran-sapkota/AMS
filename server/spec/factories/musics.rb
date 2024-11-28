FactoryBot.define do
  factory :music do
    title {"first music"}
    album_name {"album"}
    genre { [0, 1, 2, 3].sample }
    association :user
  end 
end