FactoryBot.define do
  factory :music do
    title { "Sample Song" }
    album_name { "Sample Album" }
    genre { "rock" }
    association :user
  end
end
