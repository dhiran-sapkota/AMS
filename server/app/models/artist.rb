class Artist < ApplicationRecord
  belongs_to :user, dependent: :destroy

  validates :first_release_year, numericality: { less_than: Time.now.year }
end
