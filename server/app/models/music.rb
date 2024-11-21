class Music < ApplicationRecord
  belongs_to :user

  enum genre: { rnb: 0, country: 1, classic: 2, rock: 3, jazz:4 }
end
