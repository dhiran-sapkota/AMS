class Music < ApplicationRecord
  belongs_to :user

  enum genre: { rnb: 0, country: 1, classic: 2, rock: 3, jazz:4 }

  validates :title, presence: true
  validates :album_name, presence: true
  validates :genre, presence: true, inclusion: { in: genres.keys }
end
