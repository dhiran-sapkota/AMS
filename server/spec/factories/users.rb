FactoryBot.define do
  factory :user do
    firstname { "Test" }
    lastname  { "User" }
    email     { "testuser@example.com" }
    password  { "password" }
    phone     { "1234567890" }
    dob       { "1990-01-01" }
    gender    { :m }
    address   { "123 Main Street" }
    role      { :artist_manager }

    trait :super_admin do
      role { :super_admin }
    end

    trait :artist do
      role { :artist }
    end
  end
end