FactoryBot.define do
  factory :artist do
    first_release_year { 2020 }
    no_of_albums_released { 3 }
    
    # Creating an associated user with role 'artist'
    association :user, factory: :user, role: :artist

    # You can also use traits for different roles if needed, for example:
    trait :with_artist_manager do
      association :user, factory: :user, role: :artist_manager
    end

    # Additional traits for customizing attributes
    trait :with_custom_release_year do
      first_release_year { 2015 }
    end

    trait :with_custom_album_count do
      no_of_albums_released { 5 }
    end
  end
end
